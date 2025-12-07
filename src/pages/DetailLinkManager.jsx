import React, { useState, useEffect } from 'react';
import { FaPlus, FaLink, FaCar, FaCalendarAlt, FaCogs, FaExchangeAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import detailLinkService from '../services/detailLinkService';
import modelService from '../services/modelService';
import yearGroupService from '../services/yearGroupService';
import detailGroupService from '../services/detailGroupService';

const DetailLinkManager = () => {
    const [links, setLinks] = useState([]);
    const [models, setModels] = useState([]); // Buraya diqqət!
    const [yearGroups, setYearGroups] = useState([]);
    const [detailGroups, setDetailGroups] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedYearGroup, setSelectedYearGroup] = useState("");
    const [selectedDetailGroup, setSelectedDetailGroup] = useState("");

    // --- DÜZƏLDİLMİŞ FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        
        // 1. Modelləri gətir (Mütləq gəlməlidir!)
        try {
            const modelsRes = await modelService.getAll();
            console.log("Gələn Modeller:", modelsRes); // KONSOLA BAX
            if (modelsRes.success || modelsRes.Success) {
                setModels(modelsRes.data || modelsRes.Data);
            } else {
                console.error("Modeller yüklənmədi:", modelsRes);
            }
        } catch (e) { console.error("Model xətası", e); }

        // 2. İllər
        try {
            const yearsRes = await yearGroupService.getAll();
            if (yearsRes.success || yearsRes.Success) setYearGroups(yearsRes.data || yearsRes.Data);
        } catch (e) { console.error("İl xətası", e); }

        // 3. Hissə Qrupları
        try {
            const detailsRes = await detailGroupService.getAll();
            if (detailsRes.success || detailsRes.Success) setDetailGroups(detailsRes.data || detailsRes.Data);
        } catch (e) { console.error("Hissə Qrupu xətası", e); }

        // 4. Mövcud Əlaqələr
        try {
            const linksRes = await detailLinkService.getAll();
            if (linksRes.success || linksRes.Success) setLinks(linksRes.data || linksRes.Data);
        } catch (e) { console.error("Link xətası", e); }

        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // --- CASCADING MƏNTİQİ ---
    const handleModelChange = async (e) => {
        const modelId = e.target.value;
        setSelectedModel(modelId);
        setSelectedYearGroup(""); 
        
        // Burada əlavə olaraq istəsən həmin modelə aid illəri gətirə bilərsən
        // Amma indiki halda bütün illəri göstəririk
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
                toast.success("Hissə qrupu əlaqələndirildi!");
                setIsModalOpen(false);
                setSelectedModel("");
                setSelectedYearGroup("");
                setSelectedDetailGroup("");
                fetchData();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Xəta baş verdi. Bu əlaqə mövcud ola bilər.");
        }
    };

    // Helper functions
    const getModelName = (id) => {
        const m = models.find(x => (x.id || x.Id) == id); // == istifadə edirik (string/number fərqi olmasın)
        return m ? (m.name || m.Name) : `ID: ${id}`;
    };
    const getYearRange = (id) => {
        const yg = yearGroups.find(x => (x.id || x.Id) == id);
        return yg ? `${yg.from || yg.From}-${yg.to || yg.To}` : `ID: ${id}`;
    };
    const getDetailGroupName = (id) => {
        const dg = detailGroups.find(x => (x.id || x.Id) == id);
        return dg ? (dg.name || dg.Name) : `ID: ${id}`;
    };

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-orange-100 rounded-xl text-orange-600"><FaLink /></span>
                        Hissə - Model Əlaqələri
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Tam struktur: Model + İl + Hissə Qrupu</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:-translate-y-1">
                    <FaPlus /> Yeni Əlaqə
                </button>
            </div>

            {loading ? <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div> : (
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

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <div className="bg-orange-600 p-6 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-white">3-lü Əlaqə Yarat</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white text-2xl transition">&times;</button>
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
                                            onChange={handleModelChange} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Seçin...</option>
                                            {/* Modeller burada listelenir */}
                                            {models.map(m => (
                                                <option key={m.id||m.Id} value={m.id||m.Id} className="text-gray-900">
                                                    {m.name||m.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 2. Year Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">İl Aralığı</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute top-3.5 left-3 text-gray-400" />
                                        <select 
                                            value={selectedYearGroup} 
                                            onChange={(e) => setSelectedYearGroup(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Seçin...</option>
                                            {yearGroups.map(yg => (
                                                <option key={yg.id||yg.Id} value={yg.id||yg.Id} className="text-gray-900">
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
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Seçin...</option>
                                            {detailGroups.map(dg => (
                                                <option key={dg.id||dg.Id} value={dg.id||dg.Id} className="text-gray-900">
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