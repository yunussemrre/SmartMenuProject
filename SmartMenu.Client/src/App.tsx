import { useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Ayarlar ve Tipler
import { API_URL } from './api/config'
import type { Category, Product, Table, User, Settings } from './types'

// Sayfalar
import { Home } from './pages/Home'
import { CategoryList } from './pages/CategoryList'
import { ProductList } from './pages/ProductList'
import { AdminPanel } from './pages/AdminPanel'
import { Login } from './pages/Login'
import { QRRedirect } from './pages/QRRedirect'
import { WaiterDashboard } from './pages/WaiterDashboard'
import { CashierDashboard } from './pages/CashierDashboard'
import { TabletSetup } from './pages/TabletSetup'
import { KitchenDashboard } from './pages/KitchenDashboard'

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  // KULLANICIYI HAFIZADAN ÇEK (Sayfa yenilense de çıkış yapmaz)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('loggedUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
  };

  const fetchData = async () => {
    try {
      const [c, p, t, s] = await Promise.all([
        axios.get(`${API_URL}/Categories`),
        axios.get(`${API_URL}/Products`),
        axios.get(`${API_URL}/Tables`),
        axios.get(`${API_URL}/Settings`)
      ]);
      setCategories(c.data);
      setProducts(p.data);
      setTables(t.data);
      setSettings(s.data);
    } catch (e) {
      console.error("Veri çekme hatası:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        {/* MÜŞTERİ EKRANLARI */}
        <Route path="/" element={<Home />} />
        <Route path="/qr/:qrKey" element={<QRRedirect />} />
        <Route path="/categories" element={<CategoryList categories={categories} settings={settings} />} />

        {/* SADECE AKTİF (STOKTA OLAN) ÜRÜNLERİ GÖSTER */}
        <Route path="/menu/:categoryId" element={<ProductList products={products.filter(p => p.isActive)} categories={categories} />} />

        {/* PERSONEL GİRİŞİ */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* KURULUM */}
        <Route path="/setup" element={<TabletSetup />} />

        {/* 🔐 ROTA KORUMASI (GİRİŞ YAPILMAMIŞSA LOGIN'E ATAR) */}
        <Route path="/waiter" element={
          user?.role === 'Waiter' ? <WaiterDashboard tables={tables} products={products} refreshData={fetchData} currentUser={user} /> : <Navigate to="/login" />
        } />

        <Route path="/cashier" element={
          user?.role === 'Cashier' ? <CashierDashboard refreshData={fetchData} /> : <Navigate to="/login" />
        } />

        <Route path="/kitchen" element={
          user?.role === 'Chef' ? <KitchenDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/admin" element={
          user?.role === 'Admin' ? <AdminPanel categories={categories} products={products} tables={tables} refreshData={fetchData} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />

      </Routes>
    </Router>
  );
}

// BU SATIR OLMAZSA "EXPORT DEFAULT" HATASI ALIRSIN:
export default App;