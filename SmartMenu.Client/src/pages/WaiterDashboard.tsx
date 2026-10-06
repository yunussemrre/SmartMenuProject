import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { API_URL } from '../api/config';
import type { Table, Product, OrderItem, Order, TableCall } from '../types';

// App.tsx'den gelecek olan currentUser (Giriş yapan garson) bilgisini kullanacağız
export const WaiterDashboard = ({ tables, products, refreshData, currentUser }: any) => {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [calls, setCalls] = useState<TableCall[]>([]);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    // --- 1. VERİ ÇEKME ---
    const fetchData = async () => {
        try {
            const [orderRes, callRes] = await Promise.all([
                axios.get(`${API_URL}/Orders`),
                axios.get(`${API_URL}/TableCalls`)
            ]);
            setOrders(orderRes.data.filter((o: Order) => !o.isPaid));
            setCalls(callRes.data.filter((c: TableCall) => !c.isHandled));
        } catch (e) { console.error(e); }
    };

    // --- 2. SIGNALR (ANLIK CANLI BAĞLANTI) KURULUMU ---
    useEffect(() => {
        fetchData();

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(API_URL.replace('/api', '') + '/menuHub') // SignalR Hub adresi
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log("SignalR Bağlantısı Başarılı!");
                    // Sunucudan gelen bildirimleri dinle
                    connection.on("ReceiveNotification", () => fetchData());
                    connection.on("RefreshCalls", () => fetchData());
                    connection.on("WaiterAssigned", () => fetchData());
                })
                .catch(e => console.log("SignalR Hatası: ", e));
        }
    }, [connection]);

    // --- 3. ÇAĞRIYI SAHİPLEN (Gidiyorum!) ---
    const claimCall = async (callId: number) => {
        try {
            // Garsonun ismini Backend'e "Ben bakıyorum" diye mühürler
            await axios.patch(`${API_URL}/TableCalls/${callId}/assign`, 
                JSON.stringify(currentUser?.username || "Garson"), 
                { headers: { 'Content-Type': 'application/json' } }
            );
            fetchData();
        } catch (e) { alert("Bu çağrıyı başka bir garson sahiplendi!"); }
    };

    // --- 4. ÇAĞRIYI TAMAMLA (Masanın Yanından Ayrılırken) ---
    const handleCallFinish = async (id: number) => {
        await axios.delete(`${API_URL}/TableCalls/${id}`);
        fetchData();
    };

    // --- 5. SİPARİŞİ GÖNDER (Garson İsmiyle) ---
    const sendOrder = async () => {
        if (!selectedTable || cart.length === 0) return;
        try {
            await axios.post(`${API_URL}/Orders`, {
                tableId: (selectedTable as any).id,
                waiterName: currentUser?.username || "Bilinmiyor", // Kimin sipariş girdiği artık belli
                totalPrice: cart.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
                isPaid: false,
                status: "Preparing",
                orderItems: cart.map(item => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice }))
            });
            await axios.put(`${API_URL}/Tables/${(selectedTable as any).id}`, { ...selectedTable, isOccupied: true });
            alert("Sipariş Onaylandı!");
            setCart([]); setSelectedTable(null); refreshData(); fetchData();
        } catch (e) { alert("Sipariş hatası!"); }
    };

    const markAsServed = async (orderId: number) => {
        await axios.patch(`${API_URL}/Orders/${orderId}/status`, "Served", { headers: { 'Content-Type': 'application/json' } });
        fetchData();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-left font-sans">
            <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-800">Operasyon Terminali</h2>
                    <p className="text-orange-600 font-bold text-[10px] uppercase tracking-widest">Hoş Geldin, {currentUser?.username || 'Garson'}</p>
                </div>
                <Link to="/login" className="bg-black text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Çıkış</Link>
            </header>

            {!selectedTable ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {tables.map((t: any) => {
                        const readyOrder = orders.find(o => o.tableId === t.id && o.status === "Ready");
                        const tableCall = calls.find(c => c.tableNo === t.tableNumber);
                        
                        return (
                            <div key={t.id} className="relative">
                                <button onClick={() => setSelectedTable(t)}
                                    className={`w-full h-44 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center transition-all active:scale-95 border-b-8 
                                    ${tableCall ? 'bg-red-600 border-red-800 text-white animate-bounce' : 
                                      readyOrder ? 'bg-green-500 border-green-700 text-white animate-pulse' : 
                                      t.isOccupied ? 'bg-orange-500 border-orange-700 text-white' : 
                                      'bg-white border-gray-200 text-gray-800'}`}>
                                    
                                    <span className="text-[10px] font-bold opacity-50 uppercase mb-1">{t.tableNumber}</span>
                                    
                                    {tableCall ? (
                                        <div className="text-center">
                                            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter italic">🔔 {tableCall.callType}</span>
                                            {tableCall.assignedWaiter && <p className="text-[10px] mt-2 font-bold opacity-80 italic">🏃 {tableCall.assignedWaiter} Gidiyor</p>}
                                        </div>
                                    ) : readyOrder ? (
                                        <span className="mt-2 bg-white text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic animate-pulse">HAZIR! 🥗</span>
                                    ) : (
                                        <span className="text-4xl font-black">{t.tableNumber.replace("Masa ","")}</span>
                                    )}
                                </button>

                                {/* ÇAĞRI AKSİYON BUTONLARI */}
                                {tableCall && !tableCall.assignedWaiter && (
                                    <button onClick={(e) => { e.stopPropagation(); claimCall(tableCall.id); }}
                                        className="absolute -top-2 -left-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-2xl border-2 border-white text-[10px] font-black uppercase">Gidiyorum!</button>
                                )}
                                {tableCall && (
                                    <button onClick={(e) => { e.stopPropagation(); handleCallFinish(tableCall.id); }}
                                        className="absolute -top-2 -right-2 bg-black text-white p-2 rounded-full shadow-2xl border-2 border-white">❌</button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto animate-in slide-in-from-right duration-300">
                    {/* Ürün Seçme Bölümü */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border h-fit text-left">
                        <div className="flex justify-between items-center mb-8 border-b pb-6">
                            <h3 className="text-2xl font-black text-orange-600 uppercase italic">{selectedTable.tableNumber}</h3>
                            <button onClick={() => setSelectedTable(null)} className="text-gray-400 font-bold text-xs uppercase">← Geri</button>
                        </div>

                        {orders.find(o => o.tableId === selectedTable.id && o.status === "Ready") && (
                            <div className="bg-green-500 text-white p-6 rounded-[2rem] mb-8 flex justify-between items-center animate-pulse">
                                <span className="font-black uppercase tracking-tighter text-sm">Ürünler Hazır, Servis Et!</span>
                                <button onClick={() => markAsServed(orders.find(o => o.tableId === selectedTable.id && o.status === "Ready")!.id)}
                                    className="bg-white text-green-600 px-6 py-2 rounded-xl font-black uppercase text-[10px]">Tamam</button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                            {products.map((p: Product) => (
                                <div key={p.id} className="flex justify-between items-center bg-gray-50 p-5 rounded-[2rem] border border-transparent hover:border-orange-100 transition-all">
                                    <div className="text-left"><div className="font-bold text-gray-800 text-lg uppercase tracking-tight">{p.name}</div><div className="text-orange-600 font-black">₺{p.price}</div></div>
                                    <button onClick={() => {
                                        const exist = cart.find(i => i.productId === p.id);
                                        if (exist) setCart(cart.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i));
                                        else setCart([...cart, { productId: p.id, quantity: 1, unitPrice: p.price, product: p }]);
                                    }} className="bg-orange-600 text-white w-12 h-12 rounded-2xl font-black text-2xl shadow-md">+</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Adisyon (Sepet) */}
                    <div className="bg-black text-white p-10 rounded-[3.5rem] shadow-2xl h-fit sticky top-10 flex flex-col justify-between min-h-[450px] text-left">
                        <div>
                            <h3 className="text-2xl font-black mb-8 italic uppercase border-b border-white/10 pb-4">Adisyon</h3>
                            <div className="space-y-4">
                                {cart.map((item: any, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3"><span className="bg-orange-500 text-black w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}</span><span className="font-medium uppercase text-gray-300">{item.product?.name}</span></div>
                                        <b className="text-orange-500 font-mono">₺{item.quantity * item.unitPrice}</b>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center mb-10"><span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Toplam</span><span className="text-5xl font-black text-orange-500 tracking-tighter">₺{cart.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)}</span></div>
                            <button onClick={sendOrder} disabled={cart.length === 0} className="w-full bg-green-600 py-6 rounded-3xl font-black uppercase text-sm hover:bg-green-700 transition-all">Siparişi Onayla</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};