import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api/config';
import type { Category, Settings } from '../types';

export const CategoryList = ({ categories, settings }: { categories: Category[], settings: Settings | null }) => {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get('table') || "0";
    const tableName = searchParams.get('tableName') || "Menü";

    const callAction = async (type: string) => {
        try {
            await axios.post(`${API_URL}/TableCalls`, { tableNo: tableName, callType: type, isHandled: false });
            alert(type + " isteğiniz iletildi!");
        } catch (error) { alert("Hata!"); }
    };

    return (
        <div className="min-h-screen bg-white p-6 pb-32 text-left font-sans">
            <div className="max-w-2xl mx-auto text-left">
                <header className="flex justify-between items-end mb-10 border-b pb-6">
                    <div>
                        {/* RESTORAN ADI ARTIK AYARLARDAN GELİYOR */}
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                            {settings?.restaurantName || "Smart Menu"}
                        </h2>
                        <p className="text-orange-600 font-bold uppercase text-xs tracking-widest mt-2">{tableName}</p>
                    </div>
                    <Link to="/" className="text-gray-300 font-bold text-[10px] uppercase border px-4 py-2 rounded-2xl">KAPAT</Link>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {categories.map(cat => (
                        <Link key={cat.id} to={`/menu/${cat.id}?table=${tableId}&tableName=${tableName}`}
                            className="relative h-60 rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white transition-all">
                            <img
                                // Eğer cat.imageUrl varsa onu kullan, yoksa internetten hazır bir kahve resmi göster
                                src={cat.imageUrl && cat.imageUrl.trim() !== "" ? cat.imageUrl : "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                                alt={cat.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex items-end p-8">
                                <span className="text-white font-black text-2xl uppercase tracking-wider">{cat.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* WIFI BİLGİSİ (Varsa görünür) */}
                {settings?.wifiPassword && (
                    <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex justify-between items-center animate-in fade-in duration-700">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ücretsiz WiFi</p>
                            <p className="text-lg font-black text-gray-800 font-mono tracking-tighter">{settings.wifiPassword}</p>
                        </div>
                        <span className="text-2xl opacity-20 text-left">📶</span>
                    </div>
                )}

                <div className="fixed bottom-8 left-6 right-6 flex gap-4 z-50 max-w-md mx-auto">
                    <button onClick={() => callAction('Garson')} className="flex-1 bg-orange-600 text-white py-5 rounded-[2rem] shadow-2xl font-black uppercase text-xs flex items-center justify-center gap-2">🔔 Garson</button>
                    <button onClick={() => callAction('Hesap')} className="flex-1 bg-black text-white py-5 rounded-[2rem] shadow-2xl font-black uppercase text-xs flex items-center justify-center gap-2">💳 Hesap</button>
                </div>
            </div>
        </div>
    );
};