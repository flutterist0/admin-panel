import React, { useState, useEffect } from 'react';
import { FaPlus, FaImage, FaTag, FaLayerGroup, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import brandService from '../services/brandService';
import { initialBrandState } from '../models/brandModel';

const BrandManager = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialBrandState);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const result = await brandService.getAll(); 
      if (result.success) {
        setBrands(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Serverlə əlaqə kəsildi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl) {
      toast.warning("Ad və Şəkil mütləqdir!");
      return;
    }

    try {
      const result = await brandService.add(formData);
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setFormData(initialBrandState);
        fetchBrands();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Xəta baş verdi.");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    // DƏYİŞİKLİK: Burada 'min-h-screen' yoxdur. Layout onsuz da doludur.
    <div className="w-full animate-fade-in-up">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                    <FaLayerGroup />
                </span>
                Brendlər
            </h1>
            <p className="text-gray-500 mt-1 ml-1">Mövcud brendlərin siyahısı və idarə edilməsi</p>
        </div>
        
        <button 
            onClick={() => setIsModalOpen(true)} 
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
        >
          <FaPlus className="group-hover:rotate-90 transition-transform duration-300" /> 
          Yeni Brend
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
          <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
      ) : brands.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400 text-lg">Hələ heç bir məlumat yoxdur.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                <div className="h-48 relative p-6 flex items-center justify-center bg-gray-50 group-hover:bg-indigo-50/30 transition-colors">
                  <img 
                    src={brand.imageUrl} 
                    alt={brand.name} 
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
                  />
                  {brand.badge && (
                    <span className="absolute top-3 right-3 bg-amber-400/10 text-amber-600 border border-amber-400/20 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        {brand.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{brand.name}</h3>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-indigo-500 h-full w-1/3 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}

      {/* --- MODAL (Full Screen Overlay) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Arxa fon qaralması */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Kartı */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-fade-in-up">
            <div className="bg-indigo-600 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Yeni Brend</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white text-2xl transition">&times;</button>
            </div>
            
            <div className="p-8">
                <form onSubmit={handleAddSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brend Adı</label>
                    <div className="relative">
                        <FaTag className="absolute top-3.5 left-3 text-gray-400"/>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Məs: Mercedes" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge (Opsional)</label>
                    <input name="badge" value={formData.badge} onChange={handleInputChange} placeholder="Məs: Popular" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil Linki</label>
                    <div className="relative">
                        <FaImage className="absolute top-3.5 left-3 text-gray-400"/>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" required />
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

export default BrandManager;