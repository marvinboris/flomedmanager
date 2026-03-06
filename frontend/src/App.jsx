import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicaments from './pages/Medicaments';
import Stocks from './pages/Stocks';
import Fournisseurs from './pages/Fournisseurs';
import Commandes from './pages/Commandes';
import Rapports from './pages/Rapports';
import Utilisateurs from './pages/Utilisateurs';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-[#2E8B57] text-xl">Chargement...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="medicaments" element={<Medicaments />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="fournisseurs" element={<Fournisseurs />} />
        <Route path="commandes" element={<Commandes />} />
        <Route path="rapports" element={<Rapports />} />
        <Route path="utilisateurs" element={<Utilisateurs />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
