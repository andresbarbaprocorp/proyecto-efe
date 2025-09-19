import React from 'react';
import { Calendar as CalendarIcon, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const PendingCashCalendar = ({ transactions, suppliers }) => { // Añadir suppliers a props
  // Filtrar depósitos con fecha esperada y agrupar por día
  const depositsByDate = transactions.reduce((acc, trans) => {
    if (trans.type === 'purchase' && trans.deposits && trans.deposits.length > 0) {
      trans.deposits.forEach(dep => {
        if (dep.expectedDate) {
          const date = dep.expectedDate;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            ...dep,
            purchaseId: trans.id,
            supplierName: suppliers.find(s => s.id === trans.supplierId)?.name || 'N/A', // Obtener nombre del proveedor
            purchaseAmount: trans.amount,
          });
        }
      });
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(depositsByDate).sort();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
        Calendario de Efectivo Pendiente
      </h1>

      {sortedDates.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600">No hay efectivo pendiente programado para recibir.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                {date}
              </h2>
              <div className="space-y-3">
                {depositsByDate[date].map(dep => (
                  <div key={dep.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-gray-900 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        ${parseFloat(dep.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700">Origen: {dep.source}</p>
                      <p className="text-xs text-gray-500">Proveedor: {dep.supplierName}</p> {/* Mostrar proveedor */}
                      <p className="text-xs text-gray-500">Para Compra #{dep.purchaseId} (Total: ${dep.purchaseAmount.toLocaleString()})</p>
                      {dep.proof && <p className="text-xs text-blue-500">Comprobante: {dep.proof.name}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Aquí podrías añadir un botón para marcar como recibido */}
                      <span className="text-sm text-gray-500">Pendiente</span>
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingCashCalendar;