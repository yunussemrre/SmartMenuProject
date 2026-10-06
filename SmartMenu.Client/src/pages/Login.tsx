import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../api/config';
import type { User } from '../types';

export const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/Users`);
      const user = res.data.find((user: any) => user.username === u && user.password === p);
      if (user) {
        onLogin(user);
        if (user.role === 'Waiter') navigate('/waiter');
        else if (user.role === 'Cashier') navigate('/cashier');
        else if (user.role === 'Admin') navigate('/admin');
        else if (user.role === 'Chef') navigate('/kitchen'); // YENİ
      } else alert("Hatalı Giriş!");
    } catch (e) { alert("Sistem Hatası!"); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-left">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter italic">Personel</h2>
        <input type="text" placeholder="Kullanıcı" className="w-full p-4 bg-gray-100 rounded-2xl mb-4 outline-none border-none focus:ring-2 focus:ring-orange-500" onChange={e => setU(e.target.value)} />
        <input type="password" placeholder="Şifre" className="w-full p-4 bg-gray-100 rounded-2xl mb-6 outline-none border-none focus:ring-2 focus:ring-orange-500" onChange={e => setP(e.target.value)} />
        <button className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-orange-700 transition-all">GİRİŞ</button>
      </form>
    </div>
  );
};