import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';
import type { Order } from '../types';

export const CashierDashboard = ({ refreshData }: any) => {
    const [orders, setOrders] = useState<Order[]>([]);
  
    const fetchOrders = async () => {
      const res = await axios.get(`${API_URL}/Orders`);
      setOrders(res.data.filter((o: Order) => !o.isPaid));
    };
  
    useEffect(() => { 
        fetchOrders(); 
        const int = setInterval(fetchOrders, 5000); 
        return () => clearInterval(int); 
    }, []);
  
    const handlePay = async (order: Order) => {
      if (!window.confirm("Hesap kapatılsın ve masa boşaltılsın mı?")) return;
      
      try {
          // 1. Önce siparişi ödendi olarak işaretle
          await axios.put(`${API_URL}/Orders/${order.id}`, { ...order, isPaid: true });
          
          // 2. Siparişin bağlı olduğu masayı bul ve isOccupied: false yap
          const tableRes = await axios.get(`${API_URL}/Tables/${order.tableId}`);
          const table = tableRes.data;
          await axios.put(`${API_URL}/Tables/${order.tableId}`, { ...table, isOccupied: false });
          
          alert("Ödeme alındı ve masa boşaltıldı!");
          fetchOrders(); // Kasa listesini yenile
          if(refreshData) refreshData(); // Global masaları yenile
      } catch (e) {
          alert("İşlem sırasında bir hata oluştu!");
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-left">
        <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tighter text-gray-800">Kasa Terminali</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-8 rounded-[3rem] shadow-sm border-2 border-gray-100 flex flex-col justify-between hover:border-black transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-black italic">{o.table?.tableNumber || `Masa ${o.tableId}`}</span>
                    <span className="bg-orange-100 text-orange-600 text-[10px] px-3 py-1 rounded-full font-bold">AKTİF</span>
                </div>
                <div className="space-y-2 mb-8">
                    {o.orderItems?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-500">
                            <span>{item.quantity}x {item.product?.name}</span>
                            <span className="font-mono">₺{item.quantity * item.unitPrice}</span>
                        </div>
                    ))}
                </div>
              </div>
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase">Toplam</span>
                    <span className="text-3xl font-black tracking-tighter">₺{o.totalPrice}</span>
                </div>
                <button onClick={() => handlePay(o)} className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">Ödemeyi Al & Masayı Boşalt</button>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="col-span-full py-20 text-gray-300 text-center italic uppercase tracking-widest text-xl">Açık masa bulunmuyor ☕</div>}
        </div>
      </div>
    );
};