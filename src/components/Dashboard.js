import React from 'react';
import { DollarSign, TrendingUp, Users, Building, CreditCard, AlertCircle } from 'lucide-react';

const Dashboard = ({ transactions, branches, currentUser }) => {
  // Calcular métricas básicas
  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalProfit = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + (t.profit || 0), 0);
  
  const totalClients = new Set(transactions
    .filter(t => t.type === 'sale')
    .map(t => t.clientId)).size;

  const totalOrders = transactions.filter(t => t.type === 'order').length;

  const metrics = [
    { label: 'Ventas Totales', value: `$${totalSales.toLocaleString()}`, icon: DollarSign, color: 'blue' },
    { label: 'Ganancia Total', value: `$${totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'green' },
    { label: 'Clientes Activos', value: totalClients, icon: Users, color: 'purple' },
    { label: 'Pedidos Pendientes', value: totalOrders, icon: CreditCard, color: 'orange' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido, {currentUser.name}!</h1>
        <p className="text-gray-600 mt-2">Aquí tienes un resumen rápido de tu negocio.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Operaciones Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Proveedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sucursal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 5).map((transaction) => {
                  const isSale = transaction.type === 'sale';
                  const clientOrSupplier = isSale ? 
                    (branches.find(b => b.id === transaction.clientId)?.name || 'N/A') : 
                    (branches.find(b => b.id === transaction.supplierId)?.name || 'N/A');
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isSale 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isSale ? 'Venta' : 'Pedido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clientOrSupplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branches.find(b => b.id === transaction.branchId)?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {transaction.status || 'Completado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No hay operaciones recientes. ¡Empieza a registrar algunas!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Alertas Rápidas</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-800">Fondos Propios</p>
                <p className="text-xs text-red-700">${transactions.reduce((sum, t) => {
                  if (t.type === 'order' && t.fundSource === 'own' && t.status === 'pending') {
                    return sum + t.amount;
                  }
                  return sum;
                }, 0).toLocaleString()} comprometidos</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Users className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">Clientes Activos</p>
                <p className="text-xs text-blue-700">Nuevos clientes este mes: 0</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Tendencia</p>
                <p className="text-xs text-green-700">Ganancias: +15% vs mes anterior</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;