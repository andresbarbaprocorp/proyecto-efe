import React, { useState } from 'react';
import { Plus, Search, X, Edit2, Save } from 'lucide-react';

const Suppliers = ({ suppliers, onUpdateSupplier }) => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, supplier: null });
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    phone: '',
    accountName: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.accountName && supplier.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editModal.supplier) {
      setEditModal(prev => ({
        ...prev,
        supplier: { ...prev.supplier, [name]: value }
      }));
    } else {
      setNewSupplier(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitNew = (e) => {
    e.preventDefault();
    // Lógica para añadir nuevo proveedor (por ahora solo console.log)
    console.log("Nuevo Proveedor:", newSupplier);
    // Aquí podrías llamar a una función para agregar a la lista
    setShowModal(false);
    setNewSupplier({
      name: '',
      contact: '',
      phone: '',
      accountName: '',
    });
  };

  const handleEditSupplier = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setEditModal({ show: true, supplier: { ...supplier } });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (onUpdateSupplier) {
      onUpdateSupplier(editModal.supplier);
    } else {
      console.log("Proveedor actualizado:", editModal.supplier);
    }
    setEditModal({ show: false, supplier: null });
  };

  const handleViewDetails = (supplier) => {
    setEditModal({ show: true, supplier: { ...supplier, readOnly: true } }); // Modo solo lectura para "ver"
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Proveedores</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar proveedores, contactos o cuentas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta de Depósito</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{supplier.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{supplier.phone}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {supplier.accountName || 'No asignada'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetails(supplier)}
                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                  <button 
                    onClick={() => handleEditSupplier(supplier.id)}
                    className="text-green-600 hover:text-green-900 flex items-center"
                    title="Editar proveedor"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No hay proveedores para mostrar. ¡Agrega uno nuevo!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para nuevo proveedor */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nuevo Proveedor</h2>
            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proveedor</label>
                <input
                  type="text"
                  name="name"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Proveedor Confiable S.A."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Principal</label>
                <input
                  type="text"
                  name="contact"
                  value={newSupplier.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Roberto Sánchez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 555-0789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta de Depósito</label>
                <input
                  type="text"
                  name="accountName"
                  value={newSupplier.accountName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Firsbel"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Agregar Proveedor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver/editar proveedor */}
      {editModal.show && editModal.supplier && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => setEditModal({ show: false, supplier: null })}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editModal.supplier.readOnly ? 'Detalles del Proveedor' : 'Editar Proveedor'}
            </h2>
            <form onSubmit={editModal.supplier.readOnly ? null : handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proveedor</label>
                <input
                  type="text"
                  name="name"
                  value={editModal.supplier.name}
                  onChange={editModal.supplier.readOnly ? null : handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    editModal.supplier.readOnly 
                      ? 'border-gray-300 bg-gray-100' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  readOnly={editModal.supplier.readOnly}
                  required={!editModal.supplier.readOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Principal</label>
                <input
                  type="text"
                  name="contact"
                  value={editModal.supplier.contact}
                  onChange={editModal.supplier.readOnly ? null : handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    editModal.supplier.readOnly 
                      ? 'border-gray-300 bg-gray-100' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  readOnly={editModal.supplier.readOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={editModal.supplier.phone}
                  onChange={editModal.supplier.readOnly ? null : handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    editModal.supplier.readOnly 
                      ? 'border-gray-300 bg-gray-100' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  readOnly={editModal.supplier.readOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta de Depósito</label>
                <input
                  type="text"
                  name="accountName"
                  value={editModal.supplier.accountName || ''}
                  onChange={editModal.supplier.readOnly ? null : handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    editModal.supplier.readOnly 
                      ? 'border-gray-300 bg-gray-100' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  readOnly={editModal.supplier.readOnly}
                  placeholder="Ej: Firsbel"
                />
              </div>
              {editModal.supplier.readOnly ? (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setEditModal({ show: false, supplier: null })}
                    className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Actualizar Proveedor
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;