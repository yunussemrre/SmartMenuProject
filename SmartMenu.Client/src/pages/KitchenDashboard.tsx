import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';
import type { Order } from '../types';

export const KitchenDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchKitchenOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/Orders`);
            // Sadece "Preparing" (Hazırlanıyor) olan siparişleri getir
            setOrders(res.data.filter((o: Order) => o.status === "Preparing" && !o.isPaid));
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchKitchenOrders();
        const int = setInterval(fetchKitchenOrders, 5000); // 5 saniyede bir kontrol
        return () => clearInterval(int);
    }, []);

    const markAsReady = async (orderId: number) => {
        try {
            // Durumu "Ready" (Hazır) olarak güncelle
            await axios.patch(`${API_URL}/Orders/${orderId}/status`, "Ready", {
                headers: { 'Content-Type': 'application/json' }
            });
            alert("Sipariş Hazır İşaretlendi!");
            fetchKitchenOrders();
        } catch (e) { alert("Hata!"); }
    };

    return (
        <div className="min-h-screen bg-zinc-900 p-8 text-left font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Mutfak Terminali</h2>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Canlı Sipariş Akışı</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-zinc-800 border-t-8 border-orange-600 rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between animate-in zoom-in duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-4xl font-black text-white italic">{order.table?.tableNumber || `Masa ${order.tableId}`}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">#{order.id}</span>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                {order.orderItems?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <span className="bg-zinc-700 text-orange-500 w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black">
                                                {item.quantity}
                                            </span>
                                            <span className="text-xl font-bold text-zinc-200 uppercase tracking-tight">{item.product?.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => markAsReady(order.id)}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95">
                            PİŞTİ / HAZIR ✅
                        </button>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="col-span-full py-40 text-center">
                        <p className="text-zinc-600 text-2xl italic font-medium uppercase tracking-[0.2em]">Mutfakta bekleyen iş yok 👨‍🍳</p>
                    </div>
                )}
            </div>
        </div>
    );
};