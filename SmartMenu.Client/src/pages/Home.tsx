import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MASTER_PIN } from '../api/config';

export const Home = () => {
  const assignedTableName = localStorage.getItem('assignedTableName');
  const assignedTableId = localStorage.getItem('assignedTableId');

  // RESET LOGIC (Cihaz Ayarları Şifresi)
  const [showResetModal, setShowResetModal] = useState(false);
  const [pin, setPin] = useState('');

  const handleReset = () => {
    if (pin === MASTER_PIN) {
      localStorage.clear(); // Tüm hafızayı sil
      alert("Cihaz bağlantısı kesildi. Yeniden kurulum yapılabilir.");
      window.location.reload();
    } else {
      alert("Hatalı PIN!");
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-black relative"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000")', backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className="text-center animate-in fade-in zoom-in duration-700">
        <h1 className="text-7xl font-black mb-4 italic tracking-tighter uppercase">Smart Menu</h1>

        {assignedTableName ? (
          /* --- DURUM 1: CİHAZ MASAYA BAĞLI (MÜŞTERİ MODU) --- */
          <div className="flex flex-col items-center">
            <p className="text-xl mb-8 text-orange-400 font-bold uppercase tracking-[0.3em] animate-pulse">{assignedTableName} HOŞ GELDİNİZ</p>
            <Link to={`/categories?table=${assignedTableId}&tableName=${assignedTableName}`}
              className="bg-orange-600 hover:bg-orange-700 text-white px-14 py-6 rounded-full text-2xl font-black shadow-2xl transition-all uppercase tracking-widest active:scale-95">
              MENÜYÜ AÇ
            </Link>

            {/* Personel Girişi Burada Görünmez! Sadece gizli ayarlar çarkı var. */}
            <button
              onClick={() => setShowResetModal(true)}
              className="mt-24 opacity-5 hover:opacity-100 text-[10px] uppercase font-bold tracking-[0.5em] transition-opacity">
              🔧 Cihaz Ayarları
            </button>
          </div>
        ) : (
          /* --- DURUM 2: CİHAZ BOŞTA (KURULUM MODU) --- */
          <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/20 flex flex-col items-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">⚙️</span>
            </div>
            <p className="text-xl text-white font-black uppercase tracking-widest mb-2">Cihaz Hazır Değil</p>
            <p className="text-sm text-gray-400 mb-10 max-w-[250px]">Lütfen bu tableti bir masaya bağlayın veya personel girişi yapın.</p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* KURULUM BUTONU */}
              <Link to="/setup" className="flex-1 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all text-center">
                Kurulumu Başlat
              </Link>

              {/* PERSONEL GİRİŞİ (Sadece cihaz boştayken görünür) */}
              <Link to="/login" className="flex-1 bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all text-center">
                Personel Girişi
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* GİZLİ ŞİFRE MODAL (Bağlantıyı Kesmek İçin) */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-[100] p-6 text-left">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-sm animate-in slide-in-from-bottom duration-300">
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter text-left">Güvenlik Doğrulaması</h3>
            <p className="text-gray-400 text-[10px] mb-8 font-bold uppercase tracking-widest text-left">Bu cihazı {assignedTableName} üzerinden ayırmak için MASTER PIN kodunu girin.</p>

            <input
              type="password"
              maxLength={4}
              value={pin}
              autoFocus
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              className="w-full bg-gray-100 p-5 rounded-2xl text-center text-4xl font-black tracking-[0.5em] border-none outline-none mb-8 text-gray-800 focus:ring-2 focus:ring-red-500"
            />

            <div className="flex gap-3">
              <button onClick={() => { setShowResetModal(false); setPin(''); }} className="flex-1 bg-gray-100 text-gray-400 py-4 rounded-2xl font-bold uppercase text-xs">Vazgeç</button>
              <button onClick={handleReset} className="flex-2 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">Bağlantıyı Kes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};