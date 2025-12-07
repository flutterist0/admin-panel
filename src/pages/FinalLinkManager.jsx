import React, { useState, useEffect } from 'react';
import { FaPlus, FaLink, FaCar, FaCalendarAlt, FaCogs, FaBox, FaTrash, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import finalLinkService from '../services/finalLinkService';
import modelService from '../services/modelService';
import yearGroupService from '../services/yearGroupService';
import detailGroupService from '../services/detailGroupService';
import detailService from '../services/detailService';

const FinalLinkManager = () => {
    // Siyahılar
    const [links, setLinks] = useState([]);
    
    // Dropdownlar üçün lazım olan siyahılar
    const [models, setModels] = useState([]);
    const [details, setDetails] = useState([]);
    
    // Dinamik siyahılar
    const [availableYearGroups, setAvailableYearGroups] = useState([]);
    const [availableDetailGroups, setAvailableDetailGroups] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Seçimləri
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedYearGroup, setSelectedYearGroup] = useState("");
    const [selectedDetailGroup, setSelectedDetailGroup] = useState("");
    const [selectedDetail, setSelectedDetail] = useState("");

    // --- 1. SƏHİFƏ AÇILANDA YÜKLƏNƏNLƏR ---
    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Model Siyahısı (Dropdown üçün)
            const modelRes = await modelService.getAll();
            if (modelRes.success || modelRes.Success) setModels(modelRes.data || modelRes.Data);

            // Detal Siyahısı (Dropdown üçün)
            const detailRes = await detailService.getAll();
            if (detailRes.success || detailRes.Success) setDetails(detailRes.data || detailRes.Data);

            // Hazır Əlaqə Siyahısı (Cədvəl üçün)
            const linkRes = await finalLinkService.getAll();
            if (linkRes.success || linkRes.Success) setLinks(linkRes.data || linkRes.Data);

        } catch (e) {
            console.error("Initial data load error:", e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchInitialData(); }, []);

    // --- EFFECT 1: MODEL DƏYİŞDİKDƏ İL QRUPLARINI YÜKLƏ ---
    useEffect(() => {
        setAvailableYearGroups([]);
        setSelectedYearGroup("");
        setAvailableDetailGroups([]);
        setSelectedDetailGroup("");

        if (selectedModel) {
            const fetchYearGroups = async () => {
                try {
                    const res = await yearGroupService.getByModelId(selectedModel);
                    if (res.success || res.Success) {
                        setAvailableYearGroups(res.data || res.Data);
                    } else {
                        setAvailableYearGroups([]);
                    }
                } catch (e) {
                    console.error("YearGroup fetch error:", e);
                }
            };
            fetchYearGroups();
        }
    }, [selectedModel]);

    // --- EFFECT 2: İL QRUPU DƏYİŞDİKDƏ DETAL QRUPLARINI YÜKLƏ ---
    useEffect(() => {
        setAvailableDetailGroups([]);
        setSelectedDetailGroup("");

        if (selectedModel && selectedYearGroup) {
            const fetchDetailGroups = async () => {
                try {
                    const res = await detailGroupService.getByModelAndYear(selectedModel, selectedYearGroup); 
                    if (res.success || res.Success) {
                        setAvailableDetailGroups(res.data || res.Data);
                    } else {
                        setAvailableDetailGroups([]);
                    }
                } catch (e) {
                    console.error("DetailGroup fetch error:", e);
                }
            };
            fetchDetailGroups();
        }
    }, [selectedModel, selectedYearGroup]);


    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!selectedModel || !selectedYearGroup || !selectedDetailGroup || !selectedDetail) {
            toast.warning("Bütün xanaları seçin!");
            return;
        }
        
        try {
            const res = await finalLinkService.add(selectedModel, selectedYearGroup, selectedDetailGroup, selectedDetail);
            if (res.success || res.Success) {
                toast.success("Əlaqə yaradıldı!");
                closeModal();
                fetchInitialData(); // Siyahını yenilə
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
        setSelectedDetail("");
        setAvailableYearGroups([]); 
        setAvailableDetailGroups([]);
    };

    return (
        <div className="w-full pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-green-100 rounded-xl text-green-600"><FaLink /></span>
                        Tam Əlaqələr (4-lü)
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Model + İl + Qrup + Hissə</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-105"
                >
                    <FaPlus /> Yeni Əlaqə
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-b-2 border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold"><div className="flex items-center gap-2"><FaCar className="text-indigo-500" /> Model</div></th>
                                <th className="p-4 font-semibold"><div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> İl Aralığı</div></th>
                                <th className="p-4 font-semibold"><div className="flex items-center gap-2"><FaCogs className="text-teal-500" /> Qrup</div></th>
                                <th className="p-4 font-semibold"><div className="flex items-center gap-2"><FaBox className="text-red-500" /> Hissə</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        Heç bir əlaqə tapılmadı
                                    </td>
                                </tr>
                            ) : (
                                links.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-green-50 transition">
                                        {/* Model Adı - Birbaşa API-dən gəlir */}
                                        <td className="p-4 font-bold text-gray-800">
                                            {item.modelName}
                                        </td>
                                        
                                        {/* İl Aralığı - Birbaşa API-dən gəlir */}
                                        <td className="p-4 text-gray-700">
                                            {item.from} - {item.to}
                                        </td>
                                        
                                        {/* Detal Qrup Adı - Birbaşa API-dən gəlir */}
                                        <td className="p-4 text-teal-700 font-medium">
                                            {item.detailGroupName}
                                        </td>
                                        
                                        {/* Detal Adı - Birbaşa API-dən gəlir */}
                                        <td className="p-4 text-red-700 font-medium">
                                            {item.detailName}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL HİSSƏSİ (Dəyişməyib, olduğu kimi qalır) */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <FaLink className="text-lg" />
                                    4-lü Əlaqə Yarat
                                </h2>
                                <p className="text-green-100 text-sm mt-1">Bütün sahələri doldurun</p>
                            </div>
                            <button 
                                onClick={closeModal} 
                                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <div className="space-y-6">
                                {/* ... (Form elementləri eyni qalır) ... */}
                                {/* Model Seçimi */}
                                <div className="bg-indigo-50 p-5 rounded-xl border-2 border-indigo-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FaCar className="text-indigo-600" />
                                        Model Seçin <span className="text-red-600">*</span>
                                    </label>
                                    <select 
                                        value={selectedModel} 
                                        onChange={(e) => setSelectedModel(e.target.value)} 
                                        className="w-full border-2 border-indigo-200 p-3 rounded-xl bg-white text-gray-800 outline-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition font-medium" 
                                        required
                                    >
                                        <option value="" className="text-gray-500">-- Model seçin --</option>
                                        {models.map(m => (
                                            <option key={m.id||m.Id} value={m.id||m.Id} className="text-gray-800">
                                                {m.name||m.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* İl Seçimi (Dinamik) */}
                                <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-blue-600" />
                                        İl Aralığı Seçin <span className="text-red-600">*</span>
                                    </label>
                                    <select 
                                        value={selectedYearGroup} 
                                        onChange={(e) => setSelectedYearGroup(e.target.value)} 
                                        className={`w-full border-2 border-blue-200 p-3 rounded-xl bg-white text-gray-800 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-medium ${!selectedModel && 'opacity-50 cursor-not-allowed'}`} 
                                        required
                                        disabled={!selectedModel || availableYearGroups.length === 0}
                                    >
                                        <option value="" className="text-gray-500">
                                            {selectedModel ? (availableYearGroups.length > 0 ? "-- İl aralığı seçin --" : "Bu model üçün il aralığı yoxdur") : "Əvvəlcə Model seçin"}
                                        </option>
                                        {availableYearGroups.map(yg => (
                                            <option key={yg.id||yg.Id} value={yg.id||yg.Id} className="text-gray-800">
                                                {yg.from||yg.From} - {yg.to||yg.To}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Qrup Seçimi (Dinamik) */}
                                <div className="bg-teal-50 p-5 rounded-xl border-2 border-teal-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FaCogs className="text-teal-600" />
                                        Qrup Seçin <span className="text-red-600">*</span>
                                    </label>
                                    <select 
                                        value={selectedDetailGroup} 
                                        onChange={(e) => setSelectedDetailGroup(e.target.value)} 
                                        className={`w-full border-2 border-teal-200 p-3 rounded-xl bg-white text-gray-800 outline-none cursor-pointer focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition font-medium ${(!selectedModel || !selectedYearGroup) && 'opacity-50 cursor-not-allowed'}`} 
                                        required
                                        disabled={!selectedModel || !selectedYearGroup || availableDetailGroups.length === 0}
                                    >
                                        <option value="" className="text-gray-500">
                                            {(!selectedModel || !selectedYearGroup) ? "Əvvəlcə Model və İl seçin" : (availableDetailGroups.length > 0 ? "-- Qrup seçin --" : "Bu parametrə uyğun qrup yoxdur")}
                                        </option>
                                        {availableDetailGroups.map(dg => (
                                            <option key={dg.id||dg.Id} value={dg.id||dg.Id} className="text-gray-800">
                                                {dg.name||dg.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Hissə Seçimi (Statik) */}
                                <div className="bg-red-50 p-5 rounded-xl border-2 border-red-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FaBox className="text-red-600" />
                                        Hissə Seçin <span className="text-red-600">*</span>
                                    </label>
                                    <select 
                                        value={selectedDetail} 
                                        onChange={(e) => setSelectedDetail(e.target.value)} 
                                        className="w-full border-2 border-red-200 p-3 rounded-xl bg-white text-gray-800 outline-none cursor-pointer focus:border-red-500 focus:ring-2 focus:ring-red-200 transition font-medium" 
                                        required
                                    >
                                        <option value="" className="text-gray-500">-- Hissə seçin --</option>
                                        {details.map(d => (
                                            <option key={d.id||d.Id} value={d.id||d.Id} className="text-gray-800">
                                                {d.name||d.Name} ({d.price||d.Price} ₼)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-b-2xl border-t-2 border-gray-200 flex gap-4">
                            <button 
                                type="button" 
                                onClick={closeModal} 
                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition transform hover:scale-105"
                            >
                                Ləğv et
                            </button>
                            <button 
                                onClick={handleAddSubmit} 
                                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Əlaqə Yarat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinalLinkManager;