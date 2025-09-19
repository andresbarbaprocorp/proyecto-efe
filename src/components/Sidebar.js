import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Truck, UserCheck, Building, CreditCard, BarChart3, Settings, CalendarDays, DollarSign, Banknote } from 'lucide-react';

const Sidebar = ({ currentUser }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/suppliers', icon: Truck, label: 'Proveedores' },
    { path: '/brokers', icon: UserCheck, label: 'Brokers' },
    { path: '/branches', icon: Building, label: 'Sucursales' },
    { path: '/transactions', icon: CreditCard, label: 'Operaciones' },
    { path: '/saldos-cuentas', icon: Banknote, label: 'Saldos Cuentas' }, // Nuevo enlace
    { path: '/purchase-management', icon: DollarSign, label: 'Gestión Compras' },
    { path: '/pending-cash-calendar', icon: CalendarDays, label: 'Efectivo Pendiente' },
    { path: '/reports', icon: BarChart3, label: 'Reportes' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        CashFlow Manager
      </div>
      <div className="p-4 text-sm text-gray-400">
        {currentUser.role === 'admin' ? 'Administrador Principal' : `Sucursal: ${currentUser.branchId}`}
      </div>
      <nav className="flex-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center w-full p-2 text-gray-300 hover:bg-gray-700 rounded-lg">
          <Settings className="w-5 h-5 mr-3" />
          Configuración
        </button>
      </div>
    </div>
  );
};

export default Sidebar;