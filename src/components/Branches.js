import React from 'react';
import { Plus } from 'lucide-react';

const Branches = ({ branches, currentUser }) => {
  // Si no es admin, mostrar solo su sucursal
  const visibleBranches = currentUser.role === 'admin' 
    ? branches 
    : branches.filter(b => b.id === currentUser.branchId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sucursales</h1>
        {currentUser.role === 'admin' && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Sucursal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBranches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{branch.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{branch.address}</p>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Efectivo disponible:</span>
                <span className="text-sm font-medium text-gray-800">${branch.cashBalance.toLocaleString()}</span>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                  Ver detalles
                </button>
                {currentUser.role === 'admin' && (
                  <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium">
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branches;



// Módulo de operaciones/transacciones