import React, { useState } from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';

const Reports = ({ transactions, branches, brokers, clients }) => {
  const [dateRange, setDateRange] = useState('month');
  
  // Obtener fecha actual y filtrar transacciones del mes
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const getMonthTransactions = () => {
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });
  };
  
  const monthTransactions = getMonthTransactions();
  
  // Función para obtener nombre del cliente
  const getClientName = (id) => {
    return clients.find(c => c.id === id)?.name || 'N/A';
  };
  
  // Calcular ganancias totales del mes
  const monthlyProfit = monthTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + (t.profit || 0), 0);
  
  // Datos para sucursales del mes
  const branchData = branches.map(branch => {
    const branchTransactions = monthTransactions.filter(t => t.branchId === branch.id && t.type === 'sale');
    const profit = branchTransactions.reduce((sum, t) => sum + (t.profit || 0), 0);
    return { name: branch.name, profit };
  });

  // Datos para brokers del mes
  const brokerData = brokers.map(broker => {
    const brokerTransactions = monthTransactions.filter(t => t.brokerId === broker.id);
    const commission = brokerTransactions.reduce((sum, t) => {
      const rate = t.brokerPercentage ? (t.brokerPercentage / 100) : broker.commissionRate;
      return sum + (t.amount * (t.salePrice || 1) * rate);
    }, 0);
    return { name: broker.name, commission };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Reportes del Mes</h1>
        <div className="flex space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Mes Actual</option>
            <option value="week">Última Semana</option>
            <option value="day">Hoy</option>
          </select>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Resumen del mes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Resumen del Mes Actual ({currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">${monthlyProfit.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Ganancias Totales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{monthTransactions.filter(t => t.type === 'sale').length}</p>
            <p className="text-sm text-gray-600">Ventas del Mes</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{monthTransactions.filter(t => t.type === 'order').length}</p>
            <p className="text-sm text-gray-600">Pedidos del Mes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ganancia por Sucursal (Mes Actual)</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {branchData.some(d => d.profit > 0) ? (
              <div className="text-center">
                <p className="text-lg font-semibold">Gráfico de Sucursales</p>
                <p className="text-sm">Ganancia total: ${branchData.reduce((sum, d) => sum + d.profit, 0).toLocaleString()}</p>
                <ul className="mt-4 space-y-2">
                  {branchData.map((branch, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{branch.name}:</span>
                      <span className="font-semibold">${branch.profit.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold">No hay datos de ganancias este mes</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Comisión de Brokers (Mes Actual)</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {brokerData.some(d => d.commission > 0) ? (
              <div className="text-center">
                <p className="text-lg font-semibold">Comisiones de Brokers</p>
                <p className="text-sm">Total comisiones: ${brokerData.reduce((sum, d) => sum + d.commission, 0).toLocaleString()}</p>
                <ul className="mt-4 space-y-2">
                  {brokerData.map((broker, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{broker.name}:</span>
                      <span className="font-semibold">${broker.commission.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold">No hay comisiones este mes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Detalle de Ventas del Mes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Porcentaje</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ganancia</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sucursal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthTransactions
                .filter(t => t.type === 'sale')
                .slice(0, 10)
                .map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{getClientName(transaction.clientId)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">${transaction.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{transaction.salePercentage}%</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    {transaction.profit ? `$${transaction.profit.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {branches.find(b => b.id === transaction.branchId)?.name || 'N/A'}
                  </td>
                </tr>
              ))}
              {monthTransactions.filter(t => t.type === 'sale').length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No hay ventas este mes
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

export default Reports;