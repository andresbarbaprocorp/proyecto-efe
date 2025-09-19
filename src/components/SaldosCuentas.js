import React, { useState } from 'react';
import { DollarSign, Plus, Eye, CheckCircle2, AlertTriangle, X } from 'lucide-react'; // Añadir X
import { mockSuppliers, MIN_ORDER_AMOUNT } from '../mockData';

const SaldosCuentas = ({ transactions, suppliers, onAddTransaction }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Calcular saldos por cuenta/proveedor
  const accountsBalance = suppliers.reduce((acc, supplier) => {
    const accountName = supplier.accountName;
    if (!accountName) return acc;

    const deposits = transactions.filter(t => t.type === 'sale' && t.depositAccount === accountName);
    const totalDeposits = deposits.reduce((sum, t) => sum + (t.depositAmount || 0), 0);

    const usedOrders = transactions.filter(t => t.type === 'order' && t.usedFromAccount === accountName);
    const totalUsed = usedOrders.reduce((sum, t) => sum + (t.usedAmount || 0), 0);

    const balance = totalDeposits - totalUsed;

    acc[accountName] = {
      ...supplier,
      balance,
      totalDeposits,
      totalUsed,
      deposits,
      usedOrders
    };

    return acc;
  }, {});

  const handleGenerateOrder = (accountName, orderAmount) => {
    // Crear nueva transacción de order usando el saldo de la cuenta
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'order',
      clientId: null,
      supplierId: suppliers.find(s => s.accountName === accountName)?.id || 1,
      brokerId: null,
      branchId: 1, // Sucursal por defecto, podrías hacerla seleccionable
      amount: orderAmount,
      purchasePrice: 0.95, // Precio por defecto, podrías hacerlo editable
      salePrice: null,
      salePercentage: null,
      brokerPercentage: null,
      profit: null,
      fundSource: 'account', // Nuevo tipo: desde cuenta acumulada
      status: 'pending',
      deposits: [],
      usedFromAccount: accountName,
      usedAmount: orderAmount
    };

    onAddTransaction(newOrder);

    // Actualizar el saldo (esto se manejaría en el estado global)
    setSelectedAccount(null);
    setShowGenerateModal(false);
  };

  const handleViewDetails = (accountName) => {
    setSelectedAccount(accountsBalance[accountName]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Saldos por Cuenta / Proveedor</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuenta / Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depositos Totales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usado en Pedidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo Disponible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.values(accountsBalance).map((account) => {
              const canGenerateOrder = account.balance >= MIN_ORDER_AMOUNT;
              return (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                    <div className="text-sm text-gray-500">Cuenta: {account.accountName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${account.totalDeposits.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${account.totalUsed.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      canGenerateOrder ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      ${account.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewDetails(account.accountName)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver Detalles
                    </button>
                    {canGenerateOrder && (
                      <button 
                        onClick={() => setShowGenerateModal(true)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Generar Pedido
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para generar pedido */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => setShowGenerateModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Generar Pedido desde Cuenta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto del Pedido (Mínimo: ${MIN_ORDER_AMOUNT.toLocaleString()})</label>
                <input 
                  type="number" 
                  min={MIN_ORDER_AMOUNT}
                  value={selectedAccount ? selectedAccount.balance : ''} 
                  onChange={(e) => setSelectedAccount(prev => ({ ...prev, balance: parseFloat(e.target.value) }))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Máximo disponible: 8,000,000+"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => {
                    if (selectedAccount) {
                      handleGenerateOrder(selectedAccount.accountName, selectedAccount.balance);
                    }
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Generar Pedido
                </button>
                <button 
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detalles de cuenta seleccionada */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedAccount(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles de {selectedAccount.accountName}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Depositos</p>
                  <p className="text-lg font-bold">${selectedAccount.totalDeposits.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Usado</p>
                  <p className="text-lg font-bold">${selectedAccount.totalUsed.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Saldo Disponible</p>
                <p className="text-xl font-bold text-green-600">${selectedAccount.balance.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => {
                  setShowGenerateModal(true);
                  setSelectedAccount(selectedAccount);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Generar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaldosCuentas;