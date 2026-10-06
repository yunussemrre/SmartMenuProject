import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { Product, Category } from '../types';

export const ProductList = ({ products, categories }: { products: Product[], categories: Category[] }) => {
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tableName = searchParams.get('tableName');

    const category = categories.find(c => c.id === Number(categoryId));
    const filteredProducts = products.filter(p => p.categoryId === Number(categoryId));

    return (
        <div className="min-h-screen bg-gray-50 pb-10 text-left">
            <div className="relative h-64 bg-orange-600 flex items-center justify-center text-white">
                <img src={category?.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                <div className="relative z-10 text-center">
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter">{category?.name}</h2>
                    <button onClick={() => navigate(-1)} className="mt-6 bg-white/20 backdrop-blur-xl border border-white/30 px-8 py-2 rounded-full font-bold">← Geri</button>
                </div>
            </div>
            <div className="p-6 max-w-2xl mx-auto grid gap-10 mt-6 text-left">
                {filteredProducts.map(p => (
                    <div key={p.id} className="flex gap-6 border-b border-gray-200 pb-8 items-center">
                        <img src={p.imageUrl} className="w-28 h-28 rounded-[2rem] object-cover shadow-lg" alt="" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 text-2xl tracking-tight">{p.name}</h3>
                                <span className="font-black text-orange-600 text-2xl">₺{p.price}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 font-light leading-relaxed">{p.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};