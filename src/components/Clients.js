import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';

const Clients = ({ clients, transactions }) => {
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    phone: '',
    deliveryAddress: '', // Nuevo campo
    defaultSalePercentage: '', // Nuevo campo
  });

  // Calcular estadísticas por cliente
  const clientsWithStats = clients.map(client => {
    const clientTransactions = transactions.filter(t => t.clientId === client.id);
    const totalSpent = clientTransactions.reduce((sum, t) => sum + (t.amount * (t.salePrice || 1)), 0); // Usar salePrice si existe, sino 1
    const transactionCount = clientTransactions.length;
    
    return {
      ...client,
      totalSpent,
      transactionCount
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para añadir el nuevo cliente a tu estado global o base de datos
    // Por ahora, solo la mostraremos en consola
    console.log("Nuevo Cliente:", newClient);
    setShowModal(false);
    setNewClient({
      name: '',
      contact: '',
      phone: '',
      deliveryAddress: '',
      defaultSalePercentage: '',
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar clientes..." 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venta Sugerida %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transacciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Gastado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientsWithStats.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{client.contact}</div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{client.deliveryAddress || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{client.defaultSalePercentage ? `${client.defaultSalePercentage}%` : 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{client.transactionCount}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${client.totalSpent.toLocaleString()}</td>
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nuevo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Cliente Corporativo Z"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Principal</label>
                <input
                  type="text"
                  name="contact"
                  value={newClient.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ana García"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={newClient.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 555-1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={newClient.deliveryAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Calle Falsa 123, Ciudad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Porcentaje de Venta Sugerido (%)</label>
                <input
                  type="number"
                  name="defaultSalePercentage"
                  value={newClient.defaultSalePercentage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 1.5 (para 1.5%)"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Agregar Cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;