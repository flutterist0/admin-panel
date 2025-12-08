import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTags, FaTrash, FaCalendarAlt, FaPercent, FaCoins, FaUserFriends, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import promocodeService from '../services/discountPromocodeService';

const PromocodeManager = () => {
    const [promocodes, setPromocodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        promoCode: "",
        startDate: "",
        endDate: "",
        isDisable: false,
        limit: "",
        discount: "",
        mimimumAmount: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await promocodeService.getAll();
            if (res.success || res.Success) {
                setPromocodes(res.data || res.Data);
            }
        } catch (error) {
            console.error("Promocode Load Error");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (showForm && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showForm]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        
        // Sadə validasiya
        if (!formData.promoCode || !formData.discount || !formData.startDate || !formData.endDate) {
            toast.warning("Ulduzlu (*) xanaları mütləq doldurun!");
            return;
        }

        // --- VACİB: BACKEND ÜÇÜN MƏLUMATIN HAZIRLANMASI ---
        const payload = {
            promoCode: formData.promoCode,
            startDate: formData.startDate,
            endDate: formData.endDate,
            isDisable: Boolean(formData.isDisable), // Boolean olduğundan əmin oluruq
            limit: Number(formData.limit),          // String-i Rəqəmə çeviririk
            discount: Number(formData.discount),    // String-i Rəqəmə çeviririk
            mimimumAmount: Number(formData.mimimumAmount) // String-i Rəqəmə çeviririk (Ad backend-dəki kimidir)
        };

        try {
            const res = await promocodeService.add(payload);
            if (res.success || res.Success) {
                toast.success("Promokod yaradıldı!");
                setShowForm(false);
                // Formu təmizləyirik
                setFormData({
                    promoCode: "", startDate: "", endDate: "", isDisable: false,
                    limit: "", discount: "", mimimumAmount: ""
                });
                fetchData();
            } else {
                // Backend-dən gələn xəta mesajını göstəririk
                toast.error(res.message || "Xəta baş verdi");
            }
        } catch (error) {
            console.error(error);
            // Əgər 400 Bad Request gəlirsə detalları konsola yazırıq
            if (error.response && error.response.data) {
                toast.error("Məlumatlar düzgün deyil (Format xətası)");
                console.log("Backend Xətası:", error.response.data);
            } else {
                toast.error("Server xətası");
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Silmək istəyirsiniz?',
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sil',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const res = await promocodeService.delete(id);
                if (res.success || res.Success) {
                    Swal.fire('Silindi!', '', 'success');
                    setPromocodes(prev => prev.filter(x => (x.id || x.Id) !== id));
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Silinmədi");
            }
        }
    };

    const formatDate = (dateString) => {
        if(!dateString) return "-";
        return new Date(dateString).toLocaleDateString('az-AZ');
    };

    const isExpired = (endDate) => {
        if (!endDate) return false;
        return new Date(endDate) < new Date();
    };

    return (
        <div className="w-full animate-fade-in-up pb-20">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-pink-100 rounded-xl text-pink-600"><FaTags /></span>
                        Endirim Kodları
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Kampaniyalar və Promokodlar</p>
                </div>
                
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-105 font-bold ${showForm ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-pink-600 text-white hover:bg-pink-700'}`}
                >
                    {showForm ? <><FaTimes /> Ləğv Et</> : <><FaPlus /> Yeni Kod</>}
                </button>
            </div>

            {/* List */}
            {loading ? <div className="text-center py-20">Yüklənir...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {promocodes.map((p) => {
                        const id = p.id || p.Id;
                        const code = p.promocode || p.Promocode;
                        const discount = p.discount || p.Discount;
                        const start = p.startDate || p.StartDate;
                        const end = p.endDate || p.EndDate;
                        const minAmount = p.mimimumAmount || p.MimimumAmount;
                        const limit = p.limit || p.Limit;
                        const usage = p.usageCounter || p.UsageCounter;
                        const isDisable = p.isDisable || p.IsDisable;

                        const expired = isExpired(end);
                        const statusColor = isDisable ? "bg-gray-100 border-gray-200 opacity-75" : (expired ? "bg-red-50 border-red-200" : "bg-white border-pink-100");

                        return (
                            <div key={id} className={`p-6 rounded-2xl shadow-sm border-2 relative group hover:shadow-xl transition duration-300 ${statusColor}`}>
                                <button onClick={() => handleDelete(id)} className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition hover:text-red-500 hover:scale-110">
                                    <FaTrash />
                                </button>

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 tracking-wider mb-2">{code}</h3>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDisable ? 'bg-gray-300 text-gray-600' : (expired ? 'bg-red-200 text-red-700' : 'bg-green-100 text-green-700')}`}>
                                            {isDisable ? "Deaktiv" : (expired ? "Vaxtı bitib" : "Aktiv")}
                                        </span>
                                    </div>
                                    <div className="text-4xl font-black text-pink-500 flex items-start">
                                        {discount}<span className="text-lg mt-1">%</span>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-pink-400 text-lg"/>
                                        <span>{formatDate(start)} - {formatDate(end)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCoins className="text-yellow-500 text-lg"/>
                                        <span>Min. Məbləğ: <b className="text-gray-800">{minAmount} ₼</b></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaUserFriends className="text-blue-400 text-lg"/>
                                        <span>Limit: <b className="text-gray-800">{usage} / {limit}</b></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- ADD FORM (Səhifənin Aşağısında) --- */}
            {showForm && (
                <div ref={formRef} className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border-2 border-pink-100 overflow-hidden animate-fade-in-up">
                    <div className="bg-pink-600 p-6 flex justify-between items-center text-white">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FaPlus /> Yeni Promokod Yarat
                        </h2>
                        <button onClick={() => setShowForm(false)} className="hover:bg-pink-700 p-2 rounded-lg transition"><FaTimes size={20}/></button>
                    </div>
                    
                    <div className="p-8 bg-gray-50">
                        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Promokod (Ad) <span className="text-red-500">*</span></label>
                                <input name="promoCode" value={formData.promoCode} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-4 rounded-xl outline-none focus:border-pink-500 bg-white text-black font-bold tracking-wider uppercase text-lg" placeholder="Məs: SUMMER2025" required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Endirim Faizi (%) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaPercent className="absolute top-4 left-4 text-gray-400"/>
                                    <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full pl-10 border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-pink-500 bg-white text-black font-medium" placeholder="10" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Min. Səbət Məbləği (AZN)</label>
                                <div className="relative">
                                    <FaCoins className="absolute top-4 left-4 text-gray-400"/>
                                    <input type="number" name="mimimumAmount" value={formData.mimimumAmount} onChange={handleInputChange} className="w-full pl-10 border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-pink-500 bg-white text-black font-medium" placeholder="50" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">İstifadə Limiti</label>
                                <div className="relative">
                                    <FaUserFriends className="absolute top-4 left-4 text-gray-400"/>
                                    <input type="number" name="limit" value={formData.limit} onChange={handleInputChange} className="w-full pl-10 border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-pink-500 bg-white text-black font-medium" placeholder="100" />
                                </div>
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 text-gray-800 cursor-pointer select-none font-bold bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition w-full">
                                    <input type="checkbox" name="isDisable" checked={formData.isDisable} onChange={handleInputChange} className="w-6 h-6 text-pink-600 rounded focus:ring-pink-500 border-gray-300" />
                                    Deaktiv et (Gizlə)
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Başlanğıc Tarixi <span className="text-red-500">*</span></label>
                                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-pink-500 bg-white text-black font-medium cursor-pointer" required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Bitmə Tarixi <span className="text-red-500">*</span></label>
                                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-3 rounded-xl outline-none focus:border-pink-500 bg-white text-black font-medium cursor-pointer" required />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-[1.01] transition-all">
                                    Yadda Saxla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromocodeManager;