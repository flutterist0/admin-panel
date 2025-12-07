import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import BrandManager from "./pages/BrandManager";
import ModelManager from "./pages/ModelManager";
import ModelYearGroupManager from './pages/ModelYearGroupManager';
import YearGroupManager from './pages/YearGroupManager';
import DetailGroupManager from './pages/DetailGroupManager';
import DetailLinkManager from './pages/DetailLinkManager';
import DetailManager from './pages/DetailManager';
import FinalLinkManager from './pages/FinalLinkManager';
import TagManager from './pages/TagManager';
import DetailTagManager from './pages/DetailTagManager';
// Qorunan Yol (Token yoxdursa login-ə atır)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <div className="text-center mt-20">
                <h2 className="text-3xl font-bold text-gray-700">
                  Xoş gəldiniz, Admin!
                </h2>
                <p className="text-gray-500 mt-2">
                  Sol menyudan idarəetmə panelini seçin.
                </p>
              </div>
            }
          />{" "}
          <Route path="brands" element={<BrandManager />} />
          <Route path="models" element={<ModelManager />} />{" "}
          {/* YENİ MODEL ROUTE-U */}
          <Route path="years" element={<YearGroupManager />} />
          <Route path="model-years" element={<ModelYearGroupManager />} />
          <Route path="details" element={<DetailGroupManager />} />
<Route path="detail-links" element={<DetailLinkManager />} />
<Route path="all-details" element={<DetailManager />} />
<Route path="final-links" element={<FinalLinkManager />} />
<Route path="tags" element={<TagManager />} />
<Route path="detail-tags" element={<DetailTagManager />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
