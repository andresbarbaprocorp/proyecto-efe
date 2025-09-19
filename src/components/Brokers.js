import React from 'react';
import { Plus, Search } from 'lucide-react';

const Brokers = ({ brokers, transactions }) => {
  // Calcular comisiones por broker
  const brokersWithStats = brokers.map(broker => {
    const brokerTransactions = transactions.filter(t => t.brokerId === broker.id);
    const totalCommission = brokerTransactions.reduce((sum, t) => {
      return sum + (t.amount * t.salePrice * broker.commissionRate);
    }, 0);
    const transactionCount = brokerTransactions.length;
    
    return {
      ...broker,
      totalCommission,
      transactionCount
    };
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Brokers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Broker
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar brokers..." 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Broker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasa Comisión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transacciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comisión Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brokersWithStats.map((broker) => (
              <tr key={broker.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{broker.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{broker.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{(broker.commissionRate * 100).toFixed(1)}%</td>
                <td className="px-6 py-4 text-sm text-gray-900">{broker.transactionCount}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${broker.totalCommission.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brokers;



// Módulo de gestión de sucursales