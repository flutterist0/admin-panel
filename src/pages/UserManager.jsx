import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserShield, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import userService from '../services/userService';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers();
            // Backend birbaşa List qaytarır (Success/Data strukturu yoxdur)
            setUsers(data); 
        } catch (error) {
            toast.error("İstifadəçiləri yükləmək mümkün olmadı. İcazəniz olmaya bilər.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Rol rəngini təyin etmək üçün köməkçi funksiya
    const getRoleBadgeColor = (role) => {
        if (role.toLowerCase() === 'admin') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    return (
        <div className="w-full animate-fade-in-up pb-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><FaUsers /></span>
                        İstifadəçilər
                    </h1>
                    <p className="text-gray-500 mt-1 ml-1">Sistemdə qeydiyyatdan keçən bütün istifadəçilər</p>
                </div>
                {/* Gələcəkdə bura "Export to Excel" və ya "Add User" düyməsi qoya bilərsən */}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold">İstifadəçi Adı</th>
                                    <th className="p-4 font-semibold">Ad Soyad</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Telefon</th>
                                    <th className="p-4 font-semibold">Rollar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            Heç bir istifadəçi tapılmadı.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-indigo-50/30 transition duration-200">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                        {user.userName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-gray-800">{user.userName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-700 font-medium">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400 text-xs" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FaPhone className="text-gray-400 text-xs" />
                                                    {user.phoneNumber || "-"}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles && user.roles.map((role, index) => (
                                                        <span 
                                                            key={index} 
                                                            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getRoleBadgeColor(role)}`}
                                                        >
                                                            {role.toLowerCase() === 'admin' ? <FaUserShield /> : <FaUser />}
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-right">
                        Ümumi istifadəçi sayı: {users.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;