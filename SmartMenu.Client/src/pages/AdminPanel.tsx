import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { API_URL } from '../api/config';
import type { Category, Product, Table, TableCall, Order, User } from '../types';

export const AdminPanel = ({ categories, products, tables, refreshData }: any) => {
    const [isLogged, setIsLogged] = useState(false);
    const [pass, setPass] = useState('');
    const [tab, setTab] = useState<'dash' | 'p' | 'c' | 't' | 'u' | 'stats' | 'calls'>('dash');
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [calls, setCalls] = useState<TableCall[]>([]);
    const [uploading, setUploading] = useState(false);

    // Formlar
    const [newP, setNewP] = useState({ name: '', price: 0, description: '', imageUrl: '', categoryId: 0, isActive: true });
    const [newC, setNewC] = useState({ name: '', imageUrl: '' });
    const [newU, setNewU] = useState({ username: '', password: '', role: 'Waiter' });

    const fetchAdminData = async () => {
        try {
            const [o, u, c] = await Promise.all([
                axios.get(`${API_URL}/Orders`),
                axios.get(`${API_URL}/Users`),
                axios.get(`${API_URL}/TableCalls`)
            ]);
            setOrders(o.data);
            setUsers(u.data);
            setCalls(c.data.filter((x: any) => !x.isHandled));
        } catch (e) { console.error(e); }
    };

    useEffect(() => { if (isLogged) fetchAdminData(); }, [isLogged]);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post(`${API_URL}/Upload`, formData);
        return res.data.url;
    };

    const handleFileChange = async (e: any, type: 'p' | 'c') => {
        const file = e.target.files[0]; if (!file) return;
        setUploading(true);
        const url = await uploadImage(file);
        if (type === 'p') setNewP({ ...newP, imageUrl: url });
        else setNewC({ ...newC, imageUrl: url });
        setUploading(false);
    };

    const del = async (path: string, id: number) => {
        if (window.confirm("Emin misiniz?")) {
            await axios.delete(`${API_URL}/${path}/${id}`);
            refreshData(); fetchAdminData();
        }
    };

    // QR Kod İndirme
    const downloadQR = (tableNumber: string) => {
        const svg = document.getElementById(`qr-${tableNumber}`);
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width; canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `${tableNumber}-QR.png`;
                downloadLink.href = `${pngFile}`;
                downloadLink.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        }
    };

    if (!isLogged) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-left">
                <form onSubmit={(e) => { e.preventDefault(); if (pass === '1234') setIsLogged(true); else alert('Hatalı!'); }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full">
                    <h2 className="text-3xl font-black mb-8 text-center tracking-tighter">YÖNETİM</h2>
                    <input type="password" placeholder="Şifre" className="w-full p-4 bg-gray-100 rounded-2xl mb-6 outline-none" onChange={(e) => setPass(e.target.value)} />
                    <button className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl">GİRİŞ YAP</button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-10 text-left font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-wrap justify-between items-center mb-10 gap-6">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Smart Kontrol</h2>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setTab('dash')} className={`px-4 py-2 rounded-xl font-bold ${tab === 'dash' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-400'}`}>Özet</button>
                        <button onClick={() => setTab('p')} className={`px-4 py-2 rounded-xl font-bold ${tab === 'p' ? 'bg-black text-white shadow-md' : 'bg-white text-gray-400'}`}>Ürünler</button>
                        <button onClick={() => setTab('c')} className={`px-4 py-2 rounded-xl font-bold ${tab === 'c' ? 'bg-black text-white shadow-md' : 'bg-white text-gray-400'}`}>Kategoriler</button>
                        <button onClick={() => setTab('t')} className={`px-4 py-2 rounded-xl font-bold ${tab === 't' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-400'}`}>Masalar</button>
                        <button onClick={() => setTab('u')} className={`px-4 py-2 rounded-xl font-bold ${tab === 'u' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-400'}`}>Personel</button>
                        <Link to="/" className="ml-4 bg-white border px-4 py-2 rounded-xl font-bold text-gray-300">ÇIKIŞ</Link>
                    </div>
                </header>

                {/* --- MASA YÖNETİMİ (KOD ÜRETME BURADA) --- */}
                {tab === 't' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-fit">
                            <h3 className="text-xl font-bold mb-6 italic uppercase">Yeni Masa</h3>
                            <form onSubmit={async (e: any) => { 
                                e.preventDefault(); 
                                await axios.post(`${API_URL}/Tables`, { tableNumber: e.target.tName.value, isOccupied: false }); 
                                e.target.reset(); refreshData(); 
                            }} className="flex flex-col gap-4">
                                <input name="tName" type="text" placeholder="Masa Adı" className="bg-gray-50 p-4 rounded-2xl outline-none" required />
                                <button className="bg-blue-600 text-white font-black py-4 rounded-2xl">KAYDET</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y">
                                    {tables.map((t: any) => (
                                        <tr key={t.id} className="hover:bg-gray-50/50 transition-all">
                                            <td className="p-6">
                                                <div className="font-black uppercase italic text-2xl tracking-tighter text-gray-800">{t.tableNumber}</div>
                                                <button onClick={() => del('Tables', t.id)} className="text-red-400 font-bold text-[10px] uppercase hover:text-red-600">SİL</button>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-2 rounded-lg border">
                                                        <QRCodeSVG id={`qr-${t.tableNumber}`} value={`${window.location.origin}/qr/${t.qrKey}`} size={60} />
                                                    </div>
                                                    <button onClick={() => downloadQR(t.tableNumber)} className="bg-gray-100 text-gray-500 px-3 py-2 rounded-xl font-bold text-[10px] uppercase">QR İndir</button>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button 
                                                    onClick={async () => {
                                                        const res = await axios.post(`${API_URL}/Tables/${t.id}/generate-code`);
                                                        alert(`KOD: ${res.data.code}\n\nBu kodu tabletteki kurulum ekranına girin.`);
                                                    }}
                                                    className="bg-green-600 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase shadow-md hover:bg-green-700 transition-all">
                                                    Tablet Bağlama Kodu Üret
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- DİĞER SEKMELER (ÖZET) --- */}
                {tab === 'dash' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-left">
                            <div className="text-gray-400 text-xs font-bold uppercase mb-2">Toplam Ciro</div>
                            <div className="text-5xl font-black text-green-600">₺{orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0)}</div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-left">
                            <div className="text-gray-400 text-xs font-bold uppercase mb-2">Masalar</div>
                            <div className="text-5xl font-black text-blue-600">{tables.length}</div>
                        </div>
                    </div>
                )}

                {/* --- ÜRÜN YÖNETİMİ --- */}
                {tab === 'p' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-fit">
                            <h3 className="text-xl font-bold mb-6 uppercase italic">Yeni Ürün</h3>
                            <form onSubmit={async (e) => { e.preventDefault(); await axios.post(`${API_URL}/Products`, newP); refreshData(); alert("Eklendi!"); }} className="flex flex-col gap-4">
                                <input type="text" placeholder="Ad" className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewP({ ...newP, name: e.target.value })} required />
                                <input type="number" placeholder="Fiyat" className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewP({ ...newP, price: Number(e.target.value) })} required />
                                <select className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewP({ ...newP, categoryId: Number(e.target.value) })} required>
                                    <option value="">Kategori...</option>
                                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button className="bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase">EKLE</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y">
                                    {products.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="p-6 flex items-center gap-4 text-left"><img src={p.imageUrl} className="w-14 h-14 rounded-xl object-cover" /><div><div className="font-bold text-lg">{p.name}</div><div className="text-[10px] text-orange-600 font-bold uppercase">{categories.find((c: any) => c.id === p.categoryId)?.name}</div></div></td>
                                            <td className="p-6 text-right font-black">₺{p.price}</td>
                                            <td className="p-6 text-right"><button onClick={() => del('Products', p.id)} className="text-red-500 font-bold text-xs">SİL</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- KATEGORİ YÖNETİMİ --- */}
                {tab === 'c' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-fit text-left">
                            <h3 className="text-xl font-bold mb-6 uppercase italic">Yeni Kategori</h3>
                            <form onSubmit={async (e) => { e.preventDefault(); await axios.post(`${API_URL}/Categories`, newC); refreshData(); alert("Eklendi!"); }} className="flex flex-col gap-4 text-left">
                                <input type="text" placeholder="Ad" className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewC({ ...newC, name: e.target.value })} required />
                                <button className="bg-black text-white font-black py-4 rounded-2xl shadow-lg uppercase text-left">Oluştur</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y">
                                    {categories.map((c: any) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="p-6 flex items-center gap-5 text-2xl font-black uppercase italic italic tracking-tighter"><img src={c.imageUrl} className="w-20 h-14 rounded-2xl object-cover" />{c.name}</td>
                                            <td className="p-6 text-right"><button onClick={() => del('Categories', c.id)} className="bg-red-50 text-red-500 font-black px-4 py-2 rounded-xl text-xs uppercase">Sil</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- PERSONEL YÖNETİMİ --- */}
                {tab === 'u' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in text-left">
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-fit">
                            <h3 className="text-xl font-bold mb-6 uppercase italic">Yeni Personel</h3>
                            <form onSubmit={async (e) => { e.preventDefault(); await axios.post(`${API_URL}/Users`, newU); fetchAdminData(); alert("Eklendi!"); }} className="flex flex-col gap-4">
                                <input type="text" placeholder="Kullanıcı Adı" className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewU({ ...newU, username: e.target.value })} required />
                                <input type="text" placeholder="Şifre" className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewU({ ...newU, password: e.target.value })} required />
                                <select className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setNewU({ ...newU, role: e.target.value })}>
                                    <option value="Waiter">Garson</option>
                                    <option value="Cashier">Kasa</option>
                                    <option value="Chef">Aşçı</option>
                                    <option value="Admin">Yönetici</option>
                                </select>
                                <button className="bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase">KAYDET</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y text-left">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="p-6 font-bold">{u.username}</td>
                                            <td className="p-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{u.role}</span></td>
                                            <td className="p-6 text-right"><button onClick={() => del('Users', u.id)} className="text-red-500 font-bold text-xs">SİL</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};