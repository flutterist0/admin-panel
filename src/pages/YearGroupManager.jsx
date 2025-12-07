import React, { useState, useEffect } from 'react';
import { FaPlus, FaCalendarAlt, FaTrash, FaArrowRight } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import yearGroupService from '../services/yearGroupService';

const YearGroupManager = () => {
    const [yearGroups, setYearGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({ from: "", to: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await yearGroupService.getAll();
            if (res.success || res.Success) {
                setYearGroups(res.data || res.Data);
            }
        } catch (error) {
            console.error("YearGroup Load Error");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.from || !formData.to) {
            toast.warning("Zəhmət olmasa illəri daxil edin");
            return;
        }
        try {
            const res = await yearGroupService.add(formData);
            if (res.success || res.Success) {
                toast.success("İl qrupu yaradıldı");
                setIsModalOpen(false);
                setFormData({ from: "", to: "" });
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
            cancelButtonText: 'Ləğv'
        });

        if (result.isConfirmed) {
            try {
                const res = await yearGroupService.delete(id);
                if (res.success || res.Success) {
                    Swal.fire('Silindi!', '', 'success');
                    setYearGroups(prev => prev.filter(x => (x.id || x.Id) !== id));
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Silinmədi");
            }
        }
    };

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-blue-100 rounded-xl text-blue-600"><FaCalendarAlt /></span>
                        İl Qrupları
                    </h1>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition">
                    <FaPlus /> Yeni İl Aralığı
                </button>
            </div>

            {loading ? <div className="text-center">Yüklənir...</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {yearGroups.map((yg) => (
                        <div key={yg.id || yg.Id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
                            <button onClick={() => handleDelete(yg.id || yg.Id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition hover:text-red-600">
                                <FaTrash />
                            </button>
                            <div className="flex items-center justify-center gap-4 text-2xl font-bold text-gray-700">
                                <span>{yg.from || yg.From}</span>
                                <FaArrowRight className="text-gray-300 text-sm" />
                                <span>{yg.to || yg.To}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6">Yeni İl Aralığı</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlanğıc</label>
                                    <input type="number" value={formData.from} onChange={(e) => setFormData({...formData, from: e.target.value})} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2010" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Son</label>
                                    <input type="number" value={formData.to} onChange={(e) => setFormData({...formData, to: e.target.value})} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2015" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4">Yadda Saxla</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearGroupManager;