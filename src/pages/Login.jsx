import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaUserShield, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';
import authService from '../services/authService';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await authService.login(credentials);
            toast.success("Xoş gəldiniz, Admin!");
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Məlumatlar yanlışdır!");
            } else {
                toast.error("Server xətası baş verdi.");
            }
        } finally {
            setLoading(false);
        }
    };

return (
        // Dəyişiklik buradadır: 'min-h-screen' yerinə 'h-screen w-full' və ya 'fixed inset-0'
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 overflow-hidden">
            <ToastContainer position="top-right" theme="dark" />
            
            {/* --- Arxa Fon Dekorasiyası (Blobs) --- */}
            {/* Buranı olduğu kimi saxla */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            {/* --- Login Kartı --- */}
            {/* Kartın kodu eyni qalır */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl animate-fade-in-up mx-4">
                 {/* ... Formun qalan hissəsi eyni qalsın ... */}
                 {/* ... Sadəcə yuxarıda 'mx-4' əlavə etdim ki, mobil telefonda kənarlara yapışmasın ... */}
                 
                 {/* KODUN QALAN HİSSƏSİ (LOGO, FORM, DÜYMƏ) EYNİDİR, BURANI DƏYİŞMƏYƏ EHTİYAC YOXDUR */}
                 
                 <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 mb-6 transform transition hover:scale-105 duration-300">
                        <FaUserShield className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wide">
                        Admin Panel
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium">Sistemə təhlükəsiz giriş</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="group">
                        <div className="relative transition-all duration-300 focus-within:scale-105">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaUser className="text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="İstifadəçi adı"
                                value={credentials.username}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-black/20 text-white placeholder-gray-500 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-black/40 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative transition-all duration-300 focus-within:scale-105">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLock className="text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Şifrə"
                                value={credentials.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-black/20 text-white placeholder-gray-500 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-black/40 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Yoxlanılır...
                            </span>
                        ) : (
                            <>
                                Daxil ol <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;