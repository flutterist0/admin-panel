import React, { useState, useEffect } from 'react';
import { FaPlus, FaCogs, FaTrash, FaImage, FaTag } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import detailGroupService from '../services/detailGroupService';

const DetailGroupManager = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({ name: "", imageUrl: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await detailGroupService.getAll();
            if (res.success || res.Success) {
                setGroups(res.data || res.Data);
            }
        } catch (error) {
            console.error("DetailGroup Load Error");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.imageUrl) {
            toast.warning("Ad və Şəkil mütləqdir");
            return;
        }
        try {
            const res = await detailGroupService.add(formData);
            if (res.success || res.Success) {
                toast.success("Hissə Qrupu yaradıldı");
                setIsModalOpen(false);
                setFormData({ name: "", imageUrl: "" });
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
            confirmButtonText: 'Sil'
        });

        if (result.isConfirmed) {
            try {
                const res = await detailGroupService.delete(id);
                if (res.success || res.Success) {
                    Swal.fire('Silindi!', '', 'success');
                    setGroups(prev => prev.filter(x => (x.id || x.Id) !== id));
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
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-teal-100 rounded-xl text-teal-600"><FaCogs /></span>
                        Hissə Qrupları
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Kateqoriyalar (Mühərrik, Təkər və s.)</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition">
                    <FaPlus /> Yeni Qrup
                </button>
            </div>

            {loading ? <div className="text-center">Yüklənir...</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groups.map((g) => (
                        <div key={g.id || g.Id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative hover:shadow-md transition">
                            <button onClick={() => handleDelete(g.id || g.Id)} className="absolute top-3 right-3 z-10 bg-white/80 p-2 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white">
                                <FaTrash size={14} />
                            </button>
                            <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
                                <img src={g.imageUrl || g.ImageUrl} alt={g.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-700">{g.name || g.Name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Yeni Hissə Qrupu</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                                <div className="relative">
                                    <FaTag className="absolute top-3.5 left-3 text-gray-400" />
                                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-10 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Mühərrik" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil URL</label>
                                <div className="relative">
                                    <FaImage className="absolute top-3.5 left-3 text-gray-400" />
                                    <input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-10 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="https://..." />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold mt-4">Yadda Saxla</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailGroupManager;