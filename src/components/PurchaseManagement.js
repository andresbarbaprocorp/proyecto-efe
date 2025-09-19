import React, { useState } from 'react';
import { Calendar, DollarSign, CheckCircle, XCircle, Plus, Eye, X } from 'lucide-react';
import DepositManager from './DepositManager';

const PurchaseManagement = ({ transactions, suppliers, onUpdateTransactionDeposits }) => {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Filtrar solo las transacciones de tipo 'order'
  const orderTransactions = transactions.filter(t => t.type === 'order');

  const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || 'N/A';

  // Calcular saldo Firsbel disponible (ventas no usadas en pedidos)
  const firsbelBalance = transactions
    .filter(t => t.type === 'sale' && t.depositAccount === 'Firsbel' && !t.usedInOrder)
    .reduce((sum, t) => sum + (t.depositAmount || 0), 0);

  const handleViewDeposits = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDepositModal(true);
  };

  const handleAddDeposit = (purchaseId, deposit) => {
    onUpdateTransactionDeposits(purchaseId, [...(selectedPurchase.deposits || []), deposit]);
    setSelectedPurchase(prev => ({ ...prev, deposits: [...(prev.deposits || []), deposit] }));
  };

  const handleDeleteDeposit = (purchaseId, depositId) => {
    const updatedDeposits = (selectedPurchase.deposits || []).filter(dep => dep.id !== depositId);
    onUpdateTransactionDeposits(purchaseId, updatedDeposits);
    setSelectedPurchase(prev => ({ ...prev, deposits: updatedDeposits }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Pedidos a Proveedor</h1>
      
      {/* Panel de saldo Firsbel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Saldo Disponible para Pedidos (Firsbel)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">${firsbelBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Saldo Actual</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">8,000,000</p>
            <p className="text-sm text-gray-600">Mínimo para Pedido</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">10,000,000</p>
            <p className="text-sm text-gray-600">Fondo Propio Sugerido</p>
          </div>
        </div>
        {firsbelBalance >= 8000000 ? (
          <p className="mt-4 text-sm text-green-600 font-medium flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            ¡Saldo suficiente para hacer un pedido de 8M+!
          </p>
        ) : (
          <p className="mt-4 text-sm text-red-600 font-medium flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            Saldo insuficiente. Faltan ${((8000000 - firsbelBalance).toLocaleString())}
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen Fondos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depósitos Recibidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendiente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderTransactions.map((order) => {
              const totalDeposited = (order.deposits || []).reduce((sum, dep) => sum + parseFloat(dep.amount), 0);
              const pendingAmount = order.amount - totalDeposited;
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getSupplierName(order.supplierId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.fundSource === 'own' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.fundSource === 'own' ? 'Propios' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${totalDeposited.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pendingAmount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      ${pendingAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'pending' ? 'Pendiente' : 'Entregado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleViewDeposits(order)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mr-2"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Depósitos
                    </button>
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkDelivered(order.id)}
                        className="text-green-600 hover:text-green-900 text-sm font-medium flex items-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Entregado
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showDepositModal && selectedPurchase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Depósitos para Pedido #{selectedPurchase.id}</h2>
            <p className="text-gray-600 mb-4">Proveedor: {getSupplierName(selectedPurchase.supplierId)} | Monto Total: ${selectedPurchase.amount.toLocaleString()}</p>
            
            <DepositManager 
              purchaseId={selectedPurchase.id}
              deposits={selectedPurchase.deposits || []}
              onAddDeposit={handleAddDeposit}
              onDeleteDeposit={handleDeleteDeposit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseManagement;