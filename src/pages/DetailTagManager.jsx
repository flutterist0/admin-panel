import React, { useState, useEffect } from 'react';
import { FaPlus, FaLink, FaTags, FaBox } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import detailTagService from '../services/detailTagService';
import detailService from '../services/detailService';
import tagService from '../services/tagService';

const DetailTagManager = () => {
    const [links, setLinks] = useState([]);
    const [tags, setTags] = useState([]);
    const [details, setDetails] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedTag, setSelectedTag] = useState("");
    const [selectedDetail, setSelectedDetail] = useState("");

    const fetchData = async () => {
        setLoading(true);
        
        try {
            const res = await tagService.getAll();
            if (res.success || res.Success) setTags(res.data || res.Data);
        } catch (e) {}

        try {
            const res = await detailService.getAll();
            if (res.success || res.Success) setDetails(res.data || res.Data);
        } catch (e) {}

        try {
            const res = await detailTagService.getAll();
            if (res.success || res.Success) setLinks(res.data || res.Data);
        } catch (e) {}

        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTag || !selectedDetail) {
            toast.warning("Hər iki xananı seçin!");
            return;
        }

        try {
            const res = await detailTagService.add(selectedTag, selectedDetail);
            if (res.success || res.Success) {
                toast.success("Əlaqə yaradıldı!");
                setIsModalOpen(false);
                setSelectedTag("");
                setSelectedDetail("");
                fetchData();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Xəta baş verdi.");
        }
    };

    // Helper functions
    const getTagName = (id) => {
        const t = tags.find(x => (x.id || x.Id) === id);
        return t ? (t.name || t.Name) : id;
    };
    const getDetailName = (id) => {
        const d = details.find(x => (x.id || x.Id) === id);
        return d ? (d.name || d.Name) : id;
    };

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><FaLink /></span>
                        Hissə - Tag Əlaqələri
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Hissələrə etiket təyin edin</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition">
                    <FaPlus /> Yeni Əlaqə
                </button>
            </div>

            {loading ? <div className="text-center">Yüklənir...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((item, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FaBox /></div>
                                <span className="font-bold text-gray-700 text-sm">{getDetailName(item.detailId || item.DetailId)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <FaTags className="text-blue-500 text-xs" />
                                <span className="text-blue-700 font-bold text-sm">#{getTagName(item.tagId || item.TagId)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="bg-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Hissəyə Tag Ver</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white text-2xl transition">&times;</button>
                        </div>
                        
                        <div className="p-8">
                            <form onSubmit={handleAddSubmit} className="space-y-6">
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hissə</label>
                                    <div className="relative">
                                        <FaBox className="absolute top-3.5 left-3 text-gray-400" />
                                        <select 
                                            value={selectedDetail} 
                                            onChange={(e) => setSelectedDetail(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 outline-none cursor-pointer"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Seçin...</option>
                                            {details.map(d => (
                                                <option key={d.id||d.Id} value={d.id||d.Id} className="text-gray-900">{d.name||d.Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                                    <div className="relative">
                                        <FaTags className="absolute top-3.5 left-3 text-gray-400" />
                                        <select 
                                            value={selectedTag} 
                                            onChange={(e) => setSelectedTag(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 outline-none cursor-pointer"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Seçin...</option>
                                            {tags.map(t => (
                                                <option key={t.id||t.Id} value={t.id||t.Id} className="text-gray-900">{t.name||t.Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition">
                                    Əlaqələndir
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailTagManager;