import React, { useState, useEffect } from 'react';
import { FaChartBar, FaMoneyBillWave, FaPercentage, FaUsers, FaTrophy } from 'react-icons/fa';
import promocodeService from '../services/promocodeService';

const PromocodeStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await promocodeService.getStatistics();
                setStats(data);
            } catch (error) {
                console.error("Stats error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-20">Yüklənir...</div>;
    if (!stats) return <div className="text-center py-20">Məlumat yoxdur</div>;

    return (
        <div className="w-full pb-10 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaChartBar className="text-purple-600" /> Promokod Analitikası
            </h1>

            {/* --- INFO CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><FaUsers size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Ümumi İstifadə</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsages}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-xl"><FaMoneyBillWave size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Ümumi Gəlir (Promo ilə)</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalRevenue} ₼</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-red-100 text-red-600 rounded-xl"><FaPercentage size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Verilən Endirim</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalDiscountGiven} ₼</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-orange-100 text-orange-600 rounded-xl"><FaTrophy size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Aktiv Kampaniyalar</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalPromocodes}</h3>
                    </div>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Kodlar üzrə Performans</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-semibold">Kod</th>
                                <th className="p-4 font-semibold">Faiz</th>
                                <th className="p-4 font-semibold">İstifadə Sayı</th>
                                <th className="p-4 font-semibold">Unikal İstifadəçi</th>
                                <th className="p-4 font-semibold">Cəmi Gəlir</th>
                                <th className="p-4 font-semibold">Son İstifadə</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.promocodes.map((promo, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-purple-700">{promo.promocodeText}</td>
                                    <td className="p-4">
                                        <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold">
                                            {promo.discountPercent}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{promo.usageCount}</td>
                                    <td className="p-4 text-gray-600">{promo.uniqueUsers}</td>
                                    <td className="p-4 text-green-600 font-bold">{promo.totalRevenue} ₼</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(promo.lastUsedDate).toLocaleDateString()} {new Date(promo.lastUsedDate).toLocaleTimeString().slice(0,5)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PromocodeStats;