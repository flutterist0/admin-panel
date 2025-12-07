import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaLayerGroup,
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaCar,
  FaCalendarAlt,
  FaLink,
  FaCogs,
  FaBox,
  FaTags,
} from "react-icons/fa";
import authService from "../services/authService";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-indigo-600 text-white shadow-lg"
      : "text-gray-400 hover:bg-slate-800 hover:text-white";

  return (
    // DƏYİŞİKLİK 1: 'h-screen w-full overflow-hidden' - Bütün ekranı tutur və kənar scrollu bağlayır
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      {/* Sidebar h-full olmalıdır */}
      <div className="w-64 h-full bg-slate-900 text-white flex flex-col shadow-2xl z-20 flex-shrink-0">
        <div className="p-6 text-2xl font-bold flex items-center gap-2 border-b border-gray-800">
          <span className="text-indigo-500">Admin</span>Panel
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard"
            )}`}
          >
            <FaHome /> Ana Səhifə
          </Link>
          <Link
            to="/dashboard/brands"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/brands"
            )}`}
          >
            <FaLayerGroup /> Brendlər
          </Link>
          <Link
            to="/dashboard/models"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/models"
            )}`}
          >
            <FaCar /> Modellər
          </Link>
          <Link
            to="/dashboard/years"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/years"
            )}`}
          >
            <FaCalendarAlt /> İl Qrupları
          </Link>
          <Link
            to="/dashboard/model-years"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/model-years"
            )}`}
          >
            <FaLink /> Model-İl Əlaqəsi
          </Link>
          <Link
            to="/dashboard/details"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/details"
            )}`}
          >
            <FaCogs /> Hissə Qrupları
          </Link>
          <Link
            to="/dashboard/detail-links"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/detail-links"
            )}`}
          >
            <FaLink /> 3-lü Əlaqələr
          </Link>
          <Link
            to="/dashboard/all-details"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/all-details"
            )}`}
          >
            <FaBox /> Bütün Hissələr
          </Link>
          <Link
            to="/dashboard/final-links"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(
              "/dashboard/final-links"
            )}`}
          >
            <FaLink /> 4-lü Əlaqələr
            
            
          </Link>
          <Link to="/dashboard/tags" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive('/dashboard/tags')}`}>
    <FaTags /> Etiketlər (Tags)
</Link>
<Link to="/dashboard/detail-tags" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive('/dashboard/detail-tags')}`}>
    <FaLink /> Hissə-Tag Əlaqəsi
</Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <FaUserCircle className="text-4xl text-gray-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {user?.unique_name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white py-2.5 rounded-xl transition-all duration-300 font-medium"
          >
            <FaSignOutAlt /> Çıxış
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      {/* DƏYİŞİKLİK 2: 'h-full overflow-y-auto' - Yalnız bu hissə scroll olur */}
      <div className="flex-1 h-full overflow-y-auto bg-gray-50 relative">
        {/* Header hissəsi (Mobil üçün və ya dekorativ) */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            İdarəetmə Paneli
          </h2>
          <span className="text-sm text-gray-400">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
