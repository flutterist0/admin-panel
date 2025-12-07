import React, { useState, useEffect } from 'react';
import { FaPlus, FaTags, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import tagService from '../services/tagService';

const TagManager = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({ name: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await tagService.getAll();
            if (res.success || res.Success) {
                setTags(res.data || res.Data);
            }
        } catch (error) {
            console.error("Tag Load Error");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.warning("Ad mütləqdir");
            return;
        }
        try {
            const res = await tagService.add(formData);
            if (res.success || res.Success) {
                toast.success("Tag yaradıldı");
                setIsModalOpen(false);
                setFormData({ name: "" });
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
                const res = await tagService.delete(id);
                if (res.success || res.Success) {
                    Swal.fire('Silindi!', '', 'success');
                    setTags(prev => prev.filter(x => (x.id || x.Id) !== id));
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
                        <span className="p-3 bg-blue-100 rounded-xl text-blue-600"><FaTags /></span>
                        Etiketlər (Tags)
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Hissələr üçün etiketlər</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition">
                    <FaPlus /> Yeni Tag
                </button>
            </div>

            {loading ? <div className="text-center">Yüklənir...</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {tags.map((t) => (
                        <div key={t.id || t.Id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition group">
                            <span className="font-bold text-lg text-gray-700">#{t.name || t.Name}</span>
                            <button onClick={() => handleDelete(t.id || t.Id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition hover:text-red-600">
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <div className="bg-blue-600 p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Yeni Tag</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition">&times;</button>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag Adı</label>
                                    <input 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({name: e.target.value})} 
                                        className="w-full border p-3 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Məs: Best Seller" 
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold mt-4 transition">Yadda Saxla</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagManager;