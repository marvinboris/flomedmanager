import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  BeakerIcon, 
  CubeIcon, 
  TruckIcon, 
  ShoppingCartIcon, 
  DocumentChartBarIcon, 
  UsersIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { logout, isAdmin, isPharmacist, isStorekeeper } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard', roles: ['administrateur', 'pharmacien', 'magasinier'] },
    { to: '/medicaments', icon: BeakerIcon, label: 'Médicaments', roles: ['administrateur', 'pharmacien'] },
    { to: '/stocks', icon: CubeIcon, label: 'Stocks', roles: ['administrateur', 'pharmacien', 'magasinier'] },
    { to: '/fournisseurs', icon: TruckIcon, label: 'Fournisseurs', roles: ['administrateur', 'pharmacien'] },
    { to: '/commandes', icon: ShoppingCartIcon, label: 'Commandes', roles: ['administrateur', 'pharmacien'] },
    { to: '/rapports', icon: DocumentChartBarIcon, label: 'Rapports', roles: ['administrateur', 'pharmacien'] },
    { to: '/utilisateurs', icon: UsersIcon, label: 'Utilisateurs', roles: ['administrateur'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => {
      if (role === 'administrateur') return isAdmin();
      if (role === 'pharmacien') return isPharmacist();
      if (role === 'magasinier') return isStorekeeper();
      return false;
    })
  );

  return (
    <div className="w-64 bg-[#2E8B57] text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-green-700">
        <h1 className="text-xl font-bold">FloMedManager</h1>
        <p className="text-sm text-green-200">Gestion Pharmacie</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white text-green-700' : 'hover:bg-green-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-green-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
