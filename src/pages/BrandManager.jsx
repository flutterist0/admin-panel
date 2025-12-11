import React, { useState, useEffect } from 'react';
import { FaPlus, FaImage, FaTag, FaLayerGroup, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // FaEdit əlavə olundu
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import brandService from '../services/brandService';

// İlkin boş dəyərlər
const initialFormState = {
    name: "",
    badge: "",
    imageUrl: ""
};

const BrandManager = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Redaktə edilən brandın ID-sini saxlamaq üçün (null = Yeni əlavə rejimi)
    const [editingBrandId, setEditingBrandId] = useState(null);

    const [formData, setFormData] = useState(initialFormState);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const result = await brandService.getAll(); 
            if (result.success || result.Success) {
                setBrands(result.data || result.Data);
            }
        } catch (error) {
            console.error("Load error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // --- MODALI AÇMAQ (ADD və ya EDIT) ---
    const openModal = (brand = null) => {
        if (brand) {
            // EDIT REJİMİ: Mövcud məlumatları forma doldur
            setEditingBrandId(brand.id || brand.Id);
            setFormData({
                name: brand.name || brand.Name,
                badge: brand.badge || brand.Badge || "",
                imageUrl: brand.imageUrl || brand.ImageUrl
            });
        } else {
            // ADD REJİMİ: Formu təmizlə
            setEditingBrandId(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBrandId(null);
        setFormData(initialFormState);
    };

    // --- SUBMIT (Həm Add, Həm Update) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.imageUrl) {
            toast.warning("Ad və Şəkil mütləqdir!");
            return;
        }

        try {
            let result;
            if (editingBrandId) {
                // UPDATE
                result = await brandService.update(editingBrandId, formData);
            } else {
                // ADD
                result = await brandService.add(formData);
            }

            if (result.success || result.Success) {
                toast.success(result.message);
                closeModal();
                fetchBrands(); // Siyahını yenilə
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Xəta baş verdi.");
        }
    };

    // --- DELETE ---
    // (Əgər delete varsa, buranı aça bilərsən)
    /*
    const handleDelete = async (id) => {
        // Swal kodları...
    }
    */

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><FaLayerGroup /></span>
                        Brendlər
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Mövcud brendləri idarə et.</p>
                </div>
                
                <button 
                    onClick={() => openModal(null)} // Null göndəririk ki, ADD rejimi olsun
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-105"
                >
                    <FaPlus /> Yeni Brend
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : brands.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">Hələ heç bir brend yoxdur.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {brands.map((brand) => (
                        <div key={brand.id || brand.Id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition group relative">
                            
                            {/* Düymələr Qrupu (Edit) */}
                            <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button 
                                    onClick={() => openModal(brand)} // Brandı göndəririk ki, EDIT rejimi olsun
                                    className="bg-white/90 p-2 rounded-full text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white transition"
                                    title="Redaktə et"
                                >
                                    <FaEdit />
                                </button>
                                {/* Silmə düyməsi lazım olsa bura əlavə edərsən */}
                            </div>

                            <div className="h-40 relative p-4 flex items-center justify-center bg-gray-50 group-hover:bg-indigo-50/30 transition-colors">
                                <img src={brand.imageUrl || brand.ImageUrl} alt={brand.name} className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
                                {(brand.badge || brand.Badge) && (
                                    <span className="absolute bottom-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                        {brand.badge || brand.Badge}
                                    </span>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-50">
                                <h3 className="font-bold text-gray-800 text-lg">{brand.name || brand.Name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                {editingBrandId ? "Brendi Yenilə" : "Yeni Brend"}
                            </h2>
                            <button onClick={closeModal} className="text-white/80 hover:text-white text-2xl transition"><FaTimes /></button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brend Adı</label>
                                    <div className="relative">
                                        <FaTag className="absolute top-3.5 left-3 text-gray-400"/>
                                        <input 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500" 
                                            placeholder="Məs: BMW" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge (Opsional)</label>
                                    <input 
                                        name="badge" 
                                        value={formData.badge} 
                                        onChange={handleInputChange} 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500" 
                                        placeholder="Məs: New" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil URL</label>
                                    <div className="relative">
                                        <FaImage className="absolute top-3.5 left-3 text-gray-400"/>
                                        <input 
                                            name="imageUrl" 
                                            value={formData.imageUrl} 
                                            onChange={handleInputChange} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500" 
                                            placeholder="https://..." 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex gap-3">
                                    <button type="button" onClick={closeModal} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition">Ləğv et</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg">
                                        {editingBrandId ? "Yenilə" : "Yadda saxla"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandManager;