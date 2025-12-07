import React, { useState, useEffect } from 'react';
import { FaPlus, FaLink, FaCar, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import modelYearGroupService from '../services/modelYearGroupService';
import modelService from '../services/modelService';
import yearGroupService from '../services/yearGroupService';

const ModelYearGroupManager = () => {
    const [links, setLinks] = useState([]); // Mövcud əlaqələr
    const [models, setModels] = useState([]); // Dropdown üçün
    const [yearGroups, setYearGroups] = useState([]); // Dropdown üçün
    
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form: İki ID seçiləcək
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedYearGroup, setSelectedYearGroup] = useState("");

    // --- DÜZƏLDİLMİŞ FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);

        // 1. Modelləri gətir
        try {
            const modelsRes = await modelService.getAll();
            console.log("Modellər:", modelsRes);
            if (modelsRes.success || modelsRes.Success) {
                setModels(modelsRes.data || modelsRes.Data);
            }
        } catch (error) {
            console.error("Model API Xətası:", error);
        }

        // 2. İlləri gətir
        try {
            const yearsRes = await yearGroupService.getAll();
            console.log("İllər:", yearsRes);
            if (yearsRes.success || yearsRes.Success) {
                setYearGroups(yearsRes.data || yearsRes.Data);
            }
        } catch (error) {
            console.error("YearGroup API Xətası:", error);
        }

        // 3. Mövcud Əlaqələri gətir
        try {
            const linksRes = await modelYearGroupService.getAll();
            console.log("Əlaqələr:", linksRes);
            if (linksRes.success || linksRes.Success) {
                setLinks(linksRes.data || linksRes.Data);
            }
        } catch (error) {
            console.error("Links API Xətası:", error);
            // Linklər yoxdursa (boşdursa) xəta verə bilər, amma dropdownlar dolmalıdır.
        }

        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!selectedModel || !selectedYearGroup) {
            toast.warning("Həm Model, həm də İl qrupu seçilməlidir!");
            return;
        }

        try {
            const res = await modelYearGroupService.add(selectedModel, selectedYearGroup);
            if (res.success || res.Success) {
                toast.success("Əlaqə yaradıldı!");
                setIsModalOpen(false);
                setSelectedModel("");
                setSelectedYearGroup("");
                fetchData();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Bu əlaqə artıq mövcud ola bilər və ya xəta baş verdi.");
        }
    };

    // ID-yə görə adları tapmaq üçün funksiyalar
    const getModelName = (id) => {
        const m = models.find(x => (x.id || x.Id) === id);
        return m ? (m.name || m.Name) : `ID: ${id}`;
    };

    const getYearRange = (id) => {
        const yg = yearGroups.find(x => (x.id || x.Id) === id);
        return yg ? `${yg.from || yg.From} - ${yg.to || yg.To}` : `ID: ${id}`;
    };

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-purple-100 rounded-xl text-purple-600"><FaLink /></span>
                        Model - İl Əlaqələri
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Hansı modelin hansı illərdə istehsal olunduğunu təyin edin.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition">
                    <FaPlus /> Yeni Əlaqə
                </button>
            </div>

            {loading ? <div className="text-center">Yüklənir...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FaCar /></div>
                                <span className="font-bold text-gray-700">{getModelName(item.modelId || item.ModelId)}</span>
                            </div>
                            
                            <FaExchangeAlt className="text-gray-300" />
                            
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-700">{getYearRange(item.yearGroupId || item.YearGroupId)}</span>
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaCalendarAlt /></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="bg-purple-600 p-6">
                            <h2 className="text-xl font-bold text-white">Modeli İllərlə Əlaqələndir</h2>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleAddSubmit} className="space-y-6">
                                
                                {/* Model Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Seçin</label>
                                    <select 
                                        value={selectedModel} 
                                        onChange={(e) => setSelectedModel(e.target.value)} 
                                        className="w-full border p-3 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="text-gray-500">Seçin...</option>
                                        {models.map(m => (
                                            <option key={m.id || m.Id} value={m.id || m.Id} className="text-gray-900">
                                                {m.name || m.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* YearGroup Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">İl Aralığı Seçin</label>
                                    <select 
                                        value={selectedYearGroup} 
                                        onChange={(e) => setSelectedYearGroup(e.target.value)} 
                                        className="w-full border p-3 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="text-gray-500">Seçin...</option>
                                        {yearGroups.map(yg => (
                                            <option key={yg.id || yg.Id} value={yg.id || yg.Id} className="text-gray-900">
                                                {yg.from || yg.From} - {yg.to || yg.To}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition">
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

export default ModelYearGroupManager;