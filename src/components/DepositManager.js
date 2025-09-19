import React, { useState } from 'react';
import { Plus, Upload, Trash, Calendar } from 'lucide-react';

const DepositManager = ({ purchaseId, deposits = [], onAddDeposit, onDeleteDeposit }) => {
  const [newDeposit, setNewDeposit] = useState({
    amount: '',
    source: '', // Ej: 'Cliente A', 'Cuenta Propia'
    proof: null, // Archivo adjunto
    expectedDate: '', // Fecha esperada de llegada al proveedor
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeposit(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewDeposit(prev => ({ ...prev, proof: e.target.files[0] }));
  };

  const handleAddDeposit = () => {
    if (newDeposit.amount && newDeposit.source && newDeposit.expectedDate) {
      onAddDeposit(purchaseId, { ...newDeposit, id: Date.now() }); // Generar ID temporal
      setNewDeposit({ amount: '', source: '', proof: null, expectedDate: '' });
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
        Gestión de Depósitos para esta Compra
      </h4>
      
      <div className="space-y-3 mb-4">
        {deposits.length === 0 ? (
          <p className="text-sm text-gray-500">No hay depósitos registrados para esta compra.</p>
        ) : (
          deposits.map(deposit => (
            <div key={deposit.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">${parseFloat(deposit.amount).toLocaleString()}</p>
                <p className="text-xs text-gray-600">Origen: {deposit.source}</p>
                <p className="text-xs text-gray-600">Fecha Esperada: {deposit.expectedDate}</p>
                {deposit.proof && <p className="text-xs text-blue-500">Comprobante: {deposit.proof.name}</p>}
              </div>
              <button 
                onClick={() => onDeleteDeposit(purchaseId, deposit.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Monto del Depósito</label>
          <input
            type="number"
            name="amount"
            value={newDeposit.amount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Monto"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Origen del Depósito</label>
          <input
            type="text"
            name="source"
            value={newDeposit.source}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Cliente X, Cuenta Propia"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fecha Esperada al Proveedor</label>
          <input
            type="date"
            name="expectedDate"
            value={newDeposit.expectedDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Comprobante (Opcional)</label>
          <input
            type="file"
            name="proof"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
      <button 
        type="button"
        onClick={handleAddDeposit}
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Añadir Depósito
      </button>
    </div>
  );
};

export default DepositManager;