import React, { useState, useEffect } from 'react';
import { FaPlus, FaCar, FaTrash, FaImage, FaTag, FaBoxOpen } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'; 
import 'react-toastify/dist/ReactToastify.css';

import modelService from '../services/modelService';
import brandService from '../services/brandService';

const ModelManager = () => {
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        imageUrl: "",
        brandId: "" 
    });

    // --- Data Yükləmə ---
    const fetchData = async () => {
        setLoading(true);

        // 1. Modelləri gətiririk
        try {
            const modelsRes = await modelService.getAll();
            if (modelsRes.success || modelsRes.Success) {
                setModels(modelsRes.data || modelsRes.Data);
            } else {
                console.error("Modellər gəlmədi:", modelsRes);
            }
        } catch (error) {
            console.error("Model API Xətası:", error);
        }

        // 2. Brendləri gətiririk
        try {
            const brandsRes = await brandService.getAll();
            if (brandsRes.success || brandsRes.Success) {
                setBrands(brandsRes.data || brandsRes.Data);
            }
        } catch (error) {
            console.error("Brend API Xətası:", error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Əlavə Etmə ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.imageUrl || !formData.brandId) {
            toast.warning("Bütün xanaları doldurun!");
            return;
        }

        const payload = {
            ...formData,
            brandId: parseInt(formData.brandId)
        };

        try {
            const result = await modelService.add(payload);
            if (result.success || result.Success) {
                toast.success(result.message || "Uğurla əlavə edildi");
                setIsModalOpen(false);
                setFormData({ name: "", imageUrl: "", brandId: "" });
                fetchData(); // Əlavə edəndə fetchData çağırmaq yaxşıdır ki, ID serverdən gəlsin
            } else {
                toast.error(result.message || "Xəta baş verdi");
            }
        } catch (error) {
            toast.error("Model əlavə edilmədi.");
        }
    };

    // --- Silmə (YENİLƏNMİŞ) ---
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: "Bu modeli silmək istədiyinizə əminsiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Bəli, sil!',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const apiRes = await modelService.delete(id);
                
                if (apiRes.success || apiRes.Success) {
                    Swal.fire('Silindi!', apiRes.message || "Model silindi", 'success');
                    
                    // --- DƏYİŞİKLİK: Local State-dən silirik (Anında reaksiya) ---
                    setModels(currentModels => currentModels.filter(m => (m.id || m.Id) !== id));
                    
                } else {
                    toast.error(apiRes.message || "Silinmədi");
                }
            } catch (error) {
                toast.error("Silinmə zamanı xəta.");
                console.error(error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const getBrandName = (id) => {
        const brand = brands.find(b => b.id === id || b.Id === id); 
        return brand ? brand.name || brand.Name : "Naməlum";
    };

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <FaCar />
                        </span>
                        Modellər
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Avtomobil modellərinin idarə edilməsi</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                    Yeni Model
                </button>
            </div>

            {/* Grid List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : models.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">Hələ heç bir model yoxdur.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {models.map((model) => (
                        <div key={model.id || model.Id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group relative">
                            
                            {/* Silmə Düyməsi */}
                            <button 
                                onClick={() => handleDelete(model.id || model.Id)}
                                className="absolute top-3 right-3 z-10 bg-white/80 p-2 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                title="Sil"
                            >
                                <FaTrash size={14} />
                            </button>

                            <div className="h-48 relative p-6 flex items-center justify-center bg-gray-50 group-hover:bg-indigo-50/30 transition-colors">
                                <img
                                    src={model.imageUrl || model.ImageUrl}
                                    alt={model.name || model.Name}
                                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                                />
                                <span className="absolute bottom-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-70">
                                    {getBrandName(model.brandId || model.BrandId)}
                                </span>
                            </div>
                            
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{model.name || model.Name}</h3>
                                <p className="text-xs text-gray-400">Brand ID: {model.brandId || model.BrandId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- ADD MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <div className="bg-indigo-600 p-6 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-white">Yeni Model</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white text-2xl transition">&times;</button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleAddSubmit} className="space-y-5">
                                {/* Brand Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brend Seçin</label>
                                    <div className="relative">
                                        <FaBoxOpen className="absolute top-3.5 left-3 text-gray-400" />
                                        <select
                                            name="brandId"
                                            value={formData.brandId}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-white text-gray-900 cursor-pointer"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Brend seçin...</option>
                                            {brands.map(b => (
                                                <option key={b.id || b.Id} value={b.id || b.Id} className="text-gray-900 bg-white py-2">
                                                    {b.name || b.Name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Model Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Adı</label>
                                    <div className="relative">
                                        <FaTag className="absolute top-3.5 left-3 text-gray-400" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Məs: X5, C-Class"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil Linki</label>
                                    <div className="relative">
                                        <FaImage className="absolute top-3.5 left-3 text-gray-400" />
                                        <input
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 pt-4 border-t">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition">Ləğv et</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition">Yadda saxla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelManager;