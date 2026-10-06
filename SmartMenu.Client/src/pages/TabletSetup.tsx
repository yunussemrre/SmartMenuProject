import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';

export const TabletSetup = () => {
    const [code, setCode] = useState('');

    const handleActivate = async () => {
        try {
            const res = await axios.post(`${API_URL}/Tables/verify-code/${code.toUpperCase()}`);
            const { tableId, tableName } = res.data;
            
            // Tableti bu masaya sonsuza kadar mühürle
            localStorage.setItem('assignedTableId', tableId.toString());
            localStorage.setItem('assignedTableName', tableName);
            
            alert(`Aktivasyon Başarılı! Bu cihaz artık: ${tableName}`);
            window.location.href = "/"; // Ana sayfaya git
        } catch (e) {
            alert("Hatalı veya süresi dolmuş kod!");
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-left font-sans">
            <div className="w-full max-w-sm text-center animate-in zoom-in duration-500">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">SmartMenu</h1>
                <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-12">Tablet Kurulumu</p>
                
                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
                    <p className="text-sm text-gray-400 mb-6 font-medium">Lütfen Admin panelinden aldığınız 5 haneli aktivasyon kodunu giriniz.</p>
                    <input 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Örn: 8F72K"
                        className="w-full bg-white/10 border-2 border-white/10 p-5 rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:border-orange-500 outline-none transition-all mb-6 uppercase"
                    />
                    <button 
                        onClick={handleActivate}
                        className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-2xl">
                        Cihazı Bağla
                    </button>
                </div>
            </div>
        </div>
    );
};