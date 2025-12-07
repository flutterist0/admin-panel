import React, { useState, useEffect } from 'react';
import { FaPlus, FaLink, FaCar, FaCalendarAlt, FaCogs, FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import detailLinkService from '../services/detailLinkService';
import modelService from '../services/modelService';
import yearGroupService from '../services/yearGroupService';
import detailGroupService from '../services/detailGroupService';

const DetailLinkManager = () => {
    // Siyahılar (Cədvəl üçün hamısı lazımdır)
    const [links, setLinks] = useState([]);
    
    // Dropdownlar üçün siyahılar
    const [models, setModels] = useState([]);
    const [detailGroups, setDetailGroups] = useState([]);
    
    // Bu state yalnız SEÇİLMİŞ modelə aid illəri saxlayacaq
    const [availableYearGroups, setAvailableYearGroups] = useState([]); 
    
    // Cədvəldə adları göstərmək üçün BÜTÜN illər lazımdır
    const [allYearGroups, setAllYearGroups] = useState([]); 

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedYearGroup, setSelectedYearGroup] = useState("");
    const [selectedDetailGroup, setSelectedDetailGroup] = useState("");

    // --- 1. İLKİN DATA YÜKLƏNMƏSİ ---
    const fetchData = async () => {
        setLoading(true);
        
        // 1. Modeller (Dropdown üçün)
        try {
            const res = await modelService.getAll();
            if (res.success || res.Success) setModels(res.data || res.Data);
        } catch (e) {}

        // 2. Hissə Qrupları (Dropdown üçün)
        try {
            const res = await detailGroupService.getAll();
            if (res.success || res.Success) setDetailGroups(res.data || res.Data);
        } catch (e) {}

        // 3. Bütün İllər (Sırf cədvəldə adları göstərmək üçün)
        try {
            const res = await yearGroupService.getAll();
            if (res.success || res.Success) setAllYearGroups(res.data || res.Data);
        } catch (e) {}

        // 4. Mövcud Əlaqələr (List)
        try {
            const res = await detailLinkService.getAll();
            if (res.success || res.Success) setLinks(res.data || res.Data);
        } catch (e) {}

        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // --- 2. MODEL SEÇİLƏNDƏ İŞLƏYƏN FUNKSİYA ---
    const handleModelChange = async (e) => {
        const modelId = e.target.value;
        setSelectedModel(modelId);
        
        // Model dəyişən kimi ili sıfırla və siyahını təmizlə
        setSelectedYearGroup("");
        setAvailableYearGroups([]);

        if (modelId) {
            try {
                // Backend-dən bu modelə aid illəri gətiririk
                const res = await yearGroupService.getByModelId(modelId);
                if (res.success || res.Success) {
                    setAvailableYearGroups(res.data || res.Data);
                } else {
                    toast.info("Bu modelə aid heç bir il qrupu tapılmadı.");
                }
            } catch (error) {
                console.error("YearGroup load error:", error);
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!selectedModel || !selectedYearGroup || !selectedDetailGroup) {
            toast.warning("Zəhmət olmasa bütün xanaları seçin!");
            return;
        }

        try {
            const res = await detailLinkService.add(selectedModel, selectedYearGroup, selectedDetailGroup);
            if (res.success || res.Success) {
                toast.success("Əlaqə yaradıldı!");
                closeModal();
                fetchData();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Xəta baş verdi.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedModel("");
        setSelectedYearGroup("");
        setSelectedDetailGroup("");
        setAvailableYearGroups([]);
    };

    // Helper functions
    const getModelName = (id) => {
        const m = models.find(x => (x.id || x.Id) == id);
        return m ? (m.name || m.Name) : `ID: ${id}`;
    };
    const getYearRange = (id) => {
        // Cədvəl üçün allYearGroups istifadə edirik
        const yg = allYearGroups.find(x => (x.id || x.Id) == id);
        return yg ? `${yg.from || yg.From}-${yg.to || yg.To}` : `ID: ${id}`;
    };
    const getDetailGroupName = (id) => {
        const dg = detailGroups.find(x => (x.id || x.Id) == id);
        return dg ? (dg.name || dg.Name) : `ID: ${id}`;
    };

    return (
        <div className="w-full pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-orange-100 rounded-xl text-orange-600"><FaLink /></span>
                        Hissə - Model Əlaqələri
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Tam struktur: Model + İl + Hissə Qrupu</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <FaPlus /> Yeni Əlaqə
                </button>
            </div>

            {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((item, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-xl transition duration-300">
                            <div className="flex items-center gap-3 border-b pb-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FaCar /></div>
                                <span className="font-bold text-gray-800">{getModelName(item.modelId || item.ModelId)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaCalendarAlt /></div>
                                <span className="text-gray-600 font-medium">{getYearRange(item.yearGroupId || item.YearGroupId)}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 pt-2 border-t border-dashed">
                                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><FaCogs /></div>
                                <span className="font-semibold text-teal-700">{getDetailGroupName(item.detailGroupId || item.DetailGroupId)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL (ORTADA VƏ QARA YAZILAR) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <div className="bg-orange-600 p-6 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-white">3-lü Əlaqə Yarat</h2>
                            <button onClick={closeModal} className="text-white/80 hover:text-white text-2xl transition">&times;</button>
                        </div>
                        
                        <div className="p-8">
                            <form onSubmit={handleAddSubmit} className="space-y-5">
                                
                                {/* 1. Model Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <div className="relative">
                                        <FaCar className="absolute top-3.5 left-3 text-gray-400" />
                                        <select 
                                            value={selectedModel} 
                                            onChange={handleModelChange} // Xüsusi funksiya
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer appearance-none font-medium"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Model seçin...</option>
                                            {models.map(m => (
                                                <option key={m.id||m.Id} value={m.id||m.Id} className="text-gray-900 font-medium">
                                                    {m.name||m.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 2. Year Select (Dynamic) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">İl Aralığı</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute top-3.5 left-3 text-gray-400" />
                                        <select 
                                            value={selectedYearGroup} 
                                            onChange={(e) => setSelectedYearGroup(e.target.value)} 
                                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer appearance-none font-medium ${!selectedModel && 'opacity-50 cursor-not-allowed'}`}
                                            required
                                            disabled={!selectedModel || availableYearGroups.length === 0}
                                        >
                                            <option value="" className="text-gray-500">
                                                {!selectedModel ? "Əvvəlcə Model seçin" : (availableYearGroups.length > 0 ? "İl seçin..." : "İl tapılmadı")}
                                            </option>
                                            {availableYearGroups.map(yg => (
                                                <option key={yg.id||yg.Id} value={yg.id||yg.Id} className="text-gray-900 font-medium">
                                                    {yg.from||yg.From} - {yg.to||yg.To}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 3. Detail Group Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hissə Qrupu</label>
                                    <div className="relative">
                                        <FaCogs className="absolute top-3.5 left-3 text-gray-400" />
                                        <select 
                                            value={selectedDetailGroup} 
                                            onChange={(e) => setSelectedDetailGroup(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer appearance-none font-medium"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Hissə Qrupu seçin...</option>
                                            {detailGroups.map(dg => (
                                                <option key={dg.id||dg.Id} value={dg.id||dg.Id} className="text-gray-900 font-medium">
                                                    {dg.name||dg.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition shadow-md hover:shadow-lg">
                                        Əlaqələndir
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

export default DetailLinkManager;