import React, { useState, useEffect } from 'react';
import { FaHistory, FaSearch } from 'react-icons/fa';
import promocodeService from '../services/promocodeService';

const PromocodeHistory = () => {
    const [history, setHistory] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await promocodeService.getAllUsages();
                setHistory(data.usages);
                setTotals({
                    count: data.totalUsages,
                    revenue: data.totalRevenue,
                    discount: data.totalDiscountGiven
                });
            } catch (error) {
                console.error("History error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Sadə axtarış funksiyası
    const filteredHistory = history.filter(item => 
        item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.promocodeText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-20">Yüklənir...</div>;

    return (
        <div className="w-full pb-10 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FaHistory className="text-blue-600" /> İstifadə Tarixçəsi
                    </h1>
                    <p className="text-gray-500 mt-1">Cəmi {totals.count} əməliyyatda {totals.discount}₼ endirim edilib.</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="User, Kod və ya Email axtar..." 
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold">İstifadəçi</th>
                                <th className="p-4 font-semibold">Kod</th>
                                <th className="p-4 font-semibold">Tarix</th>
                                <th className="p-4 font-semibold">Məbləğ (Org/Final)</th>
                                <th className="p-4 font-semibold">Endirim</th>
                                <th className="p-4 font-semibold">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredHistory.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Məlumat tapılmadı</td></tr>
                            ) : (
                                filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{item.userName}</div>
                                            <div className="text-xs text-gray-500">{item.userEmail}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-bold border border-blue-100">
                                                {item.promocodeText}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(item.usedDate).toLocaleDateString()} <br/>
                                            <span className="text-xs text-gray-400">{new Date(item.usedDate).toLocaleTimeString().slice(0,5)}</span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="line-through text-gray-400">{item.originalAmount} ₼</div>
                                            <div className="font-bold text-green-600">{item.finalAmount} ₼</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-red-500">-{item.discountAmount} ₼</div>
                                            <div className="text-xs text-gray-400">{item.discountPercent}%</div>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 font-mono">
                                            {item.ipAddress || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PromocodeHistory;