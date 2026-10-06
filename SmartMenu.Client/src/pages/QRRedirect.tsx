import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api/config';

export const QRRedirect = () => {
  const { qrKey } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkQR = async () => {
      try {
        const res = await axios.get(`${API_URL}/Tables/ByCode/${qrKey}`);
        const table = res.data;
        navigate(`/categories?table=${table.id}&tableName=${table.tableNumber}`);
      } catch (e) {
        alert("Geçersiz QR Kod!");
        navigate('/');
      }
    };
    checkQR();
  }, [qrKey, navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-left">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600 mb-4"></div>
      <p className="font-bold tracking-widest uppercase text-xs">Masa Tanınıyor...</p>
    </div>
  );
};