import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BeakerIcon, 
  CubeIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardService.getData();
      setData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#2E8B57] text-xl">Chargement...</div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Médicaments',
      value: data?.totalMedicaments || 0,
      icon: BeakerIcon,
      color: 'bg-blue-500',
      link: '/medicaments',
    },
    {
      name: 'Total Stock',
      value: data?.totalStock || 0,
      icon: CubeIcon,
      color: 'bg-green-500',
      link: '/stocks',
    },
    {
      name: 'Stock Critique',
      value: data?.lowStockCount || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      link: '/medicaments',
    },
    {
      name: 'Expirant Bientôt',
      value: data?.expiringSoonCount || 0,
      icon: ClockIcon,
      color: 'bg-orange-500',
      link: '/medicaments',
    },
    {
      name: 'Commandes Totales',
      value: data?.totalCommandes || 0,
      icon: ShoppingCartIcon,
      color: 'bg-purple-500',
      link: '/commandes',
    },
    {
      name: 'En Attente',
      value: data?.pendingCommandes || 0,
      icon: ArrowTrendingUpIcon,
      color: 'bg-yellow-500',
      link: '/commandes',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.link} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(data?.lowStockCount > 0 || data?.expiringSoonCount > 0 || data?.expiredCount > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Alertes</h2>
          <div className="space-y-3">
            {data?.lowStockCount > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Stock critique</p>
                  <p className="text-sm text-red-600">{data.lowStockCount} médicament(s) en stock critique</p>
                </div>
              </div>
            )}
            {data?.expiringSoonCount > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-center gap-3">
                <ClockIcon className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-medium text-orange-800">Expiration imminente</p>
                  <p className="text-sm text-orange-600">{data.expiringSoonCount} médicament(s) expirent dans 30 jours</p>
                </div>
              </div>
            )}
            {data?.expiredCount > 0 && (
              <div className="bg-red-50 border-l-4 border-red-700 p-4 rounded-r-lg flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-700" />
                <div>
                  <p className="font-medium text-red-800">Médicaments expirés</p>
                  <p className="text-sm text-red-600">{data.expiredCount} médicament(s) expirés</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mouvements récents</h2>
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Médicament</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentMovements?.length > 0 ? (
                data.recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{new Date(movement.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>{movement.medicament?.name}</td>
                    <td>
                      <span className={`badge ${movement.type === 'in' ? 'badge-success' : 'badge-danger'}`}>
                        {movement.type === 'in' ? 'Entrée' : 'Sortie'}
                      </span>
                    </td>
                    <td>{movement.quantity}</td>
                    <td>{movement.user?.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    Aucun mouvement récent
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
