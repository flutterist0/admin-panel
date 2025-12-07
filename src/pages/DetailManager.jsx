import React, { useState, useEffect } from 'react';
import { FaPlus, FaBox, FaTrash, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import detailService from '../services/detailService';

const DetailManager = () => {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "", description: "", oem: "", imageUrl: "", compatibility: "",
        weight: 0, isDisabled: false, isDiscount: false, isHighlight: false,
        stock: 0, price: 0, discountPrice: 0
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await detailService.getAll();
            if (res.success || res.Success) {
                setDetails(res.data || res.Data);
            }
        } catch (error) {
            console.error("Detail Load Error", error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            toast.warning("Ad və Qiymət mütləqdir!");
            return;
        }

        try {
            const res = await detailService.add(formData);
            if (res.success || res.Success) {
                toast.success("Hissə əlavə edildi");
                setIsModalOpen(false);
                setFormData({
                    name: "", description: "", oem: "", imageUrl: "", compatibility: "",
                    weight: 0, isDisabled: false, isDiscount: false, isHighlight: false,
                    stock: 0, price: 0, discountPrice: 0
                });
                fetchData();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Xəta baş verdi");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Silmək istəyirsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sil',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const res = await detailService.delete(id);
                if (res.success || res.Success) {
                    Swal.fire('Silindi!', '', 'success');
                    setDetails(prev => prev.filter(x => (x.id || x.Id) !== id));
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Silinmədi");
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: "", description: "", oem: "", imageUrl: "", compatibility: "",
            weight: 0, isDisabled: false, isDiscount: false, isHighlight: false,
            stock: 0, price: 0, discountPrice: 0
        });
    };

    return (
        <div className="w-full pb-10">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-red-100 rounded-xl text-red-600"><FaBox /></span>
                        Ehtiyat Hissələri
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Bütün detalların idarə edilməsi</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-105"
                >
                    <FaPlus /> Yeni Hissə
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {details.map((d) => (
                        <div key={d.id || d.Id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition relative group">
                            <button 
                                onClick={() => handleDelete(d.id || d.Id)} 
                                className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition hover:text-red-600 p-2 hover:bg-red-50 rounded-lg"
                            >
                                <FaTrash />
                            </button>
                            <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1">
                                <img src={d.imageUrl || d.ImageUrl} alt={d.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 line-clamp-2">{d.name || d.Name}</h3>
                                <p className="text-xs text-gray-500 mb-2">OEM: {d.oem || d.Oem}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold text-red-600">{d.price || d.Price} ₼</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Stok: {d.stock || d.Stock}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL - TAM YENİDƏN DÜZƏLDİLMİŞ */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <FaPlus className="text-lg" />
                                    Yeni Hissə Əlavə Et
                                </h2>
                                <p className="text-red-100 text-sm mt-1">Bütün məlumatları doldurun</p>
                            </div>
                            <button 
                                onClick={closeModal} 
                                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Body - Scroll olunan hissə */}
                        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Sol Sütun */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Hissənin Adı <span className="text-red-600">*</span>
                                        </label>
                                        <input 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                            placeholder="Məs: Yağ Filteri"
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Təsvir</label>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleInputChange} 
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition resize-none" 
                                            rows="4"
                                            placeholder="Məhsulun ətraflı təsviri..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">OEM Kod</label>
                                            <input 
                                                name="oem" 
                                                value={formData.oem} 
                                                onChange={handleInputChange} 
                                                className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                                placeholder="12345678"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Çəki (kq)</label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="weight" 
                                                value={formData.weight} 
                                                onChange={handleInputChange} 
                                                className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Şəkil URL</label>
                                        <input 
                                            name="imageUrl" 
                                            value={formData.imageUrl} 
                                            onChange={handleInputChange} 
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Sağ Sütun */}
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Qiymət (₼) <span className="text-red-600">*</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="price" 
                                                value={formData.price} 
                                                onChange={handleInputChange} 
                                                className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                                placeholder="0.00"
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Endirimli Qiymət (₼)</label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="discountPrice" 
                                                value={formData.discountPrice} 
                                                onChange={handleInputChange} 
                                                className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stok Sayı</label>
                                        <input 
                                            type="number" 
                                            name="stock" 
                                            value={formData.stock} 
                                            onChange={handleInputChange} 
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Uyğunluq</label>
                                        <input 
                                            name="compatibility" 
                                            value={formData.compatibility} 
                                            onChange={handleInputChange} 
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-800 transition" 
                                            placeholder="Məs: BMW E46, E90, F30"
                                        />
                                    </div>

                                    {/* Checkboxlar - Daha gözəl dizayn */}
                                    <div className="bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Əlavə Parametrlər</p>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    name="isDiscount" 
                                                    checked={formData.isDiscount} 
                                                    onChange={handleInputChange} 
                                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition">Endirimli məhsul</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    name="isHighlight" 
                                                    checked={formData.isHighlight} 
                                                    onChange={handleInputChange} 
                                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition">Seçilmiş məhsul</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    name="isDisabled" 
                                                    checked={formData.isDisabled} 
                                                    onChange={handleInputChange} 
                                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition">Deaktiv (satışda deyil)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Buttonlar */}
                        <div className="p-6 bg-gray-50 rounded-b-2xl border-t-2 border-gray-200 flex gap-4">
                            <button 
                                type="button" 
                                onClick={closeModal} 
                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition transform hover:scale-105"
                            >
                                Ləğv et
                            </button>
                            <button 
                                onClick={handleAddSubmit} 
                                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Yadda Saxla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailManager;