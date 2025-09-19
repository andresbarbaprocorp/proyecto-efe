import React, { useState, useEffect } from 'react';
import { Plus, Filter, X, CheckCircle2, DollarSign, Eye, Trash2 } from 'lucide-react';

const Transactions = ({ transactions, clients, suppliers, brokers, branches, onAddTransaction, onUpdateTransactionDeposits, onMarkAsDelivered, onCancelOrder, committedOwnFunds, ownFundsLimit }) => {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState({ show: false, transactionId: null });
  const [proofFile, setProofFile] = useState(null);
  const [viewProofModal, setViewProofModal] = useState({ show: false, proofName: null });
  const [cancelModal, setCancelModal] = useState({ show: false, transactionId: null });
  const [newTransaction, setNewTransaction] = useState({
    type: 'sale',
    amount: '',
    purchasePrice: '',
    salePercentage: '',
    clientId: '',
    supplierId: '',
    brokerId: '',
    brokerPercentage: '',
    branchId: '',
    fundSource: 'own',
    status: 'pending',
    depositAmount: '',
    depositAccount: 'Firsbel',
  });
  const [brokerCommissionAmount, setBrokerCommissionAmount] = useState(0);

  const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  const getClientName = (id) => clients.find(c => c.id === id)?.name || 'N/A';
  const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || 'N/A';
  const getBrokerName = (id) => brokers.find(b => b.id === id)?.name || 'N/A';
  const getBranchName = (id) => branches.find(br => br.id === id)?.name || 'N/A';

  const firsbelBalance = transactions
    .filter(t => t.type === 'sale' && t.depositAccount === 'Firsbel' && !t.usedInOrder)
    .reduce((sum, t) => sum + (t.depositAmount || 0), 0);

  useEffect(() => {
    if (newTransaction.type === 'sale' && newTransaction.clientId) {
      const clientSales = transactions.filter(t => t.clientId === parseInt(newTransaction.clientId) && t.type === 'sale' && t.salePercentage);
      if (clientSales.length > 0) {
        const avgSalePercentage = clientSales.reduce((sum, t) => sum + parseFloat(t.salePercentage), 0) / clientSales.length;
        if (newTransaction.salePercentage === '') {
          setNewTransaction(prev => ({ ...prev, salePercentage: avgSalePercentage.toFixed(2) }));
        }
      }
    }

    if (newTransaction.type === 'sale' && newTransaction.brokerId) {
      const broker = brokers.find(b => b.id === parseInt(newTransaction.brokerId));
      if (broker) {
        if (newTransaction.brokerPercentage === '') {
          setNewTransaction(prev => ({ ...prev, brokerPercentage: (broker.commissionRate * 100).toFixed(2) }));
        }
        
        const saleAmount = parseFloat(newTransaction.amount);
        const salePercentage = parseFloat(newTransaction.salePercentage);
        const brokerPercentage = parseFloat(newTransaction.brokerPercentage);

        if (!isNaN(saleAmount) && !isNaN(salePercentage) && !isNaN(brokerPercentage)) {
          const totalSaleValue = saleAmount * (1 + salePercentage / 100);
          setBrokerCommissionAmount(totalSaleValue * (brokerPercentage / 100));
        } else {
          setBrokerCommissionAmount(0);
        }
      } else {
        setBrokerCommissionAmount(0);
        setNewTransaction(prev => ({ ...prev, brokerPercentage: '' }));
      }
    } else {
      setBrokerCommissionAmount(0);
      setNewTransaction(prev => ({ ...prev, brokerPercentage: '' }));
    }
  }, [newTransaction.clientId, newTransaction.brokerId, newTransaction.type, newTransaction.amount, newTransaction.salePercentage, newTransaction.brokerPercentage, transactions, brokers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionToSave = {
      ...newTransaction,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    if (newTransaction.type === 'sale') {
      const saleAmount = parseFloat(newTransaction.amount);
      const salePercentage = parseFloat(newTransaction.salePercentage);
      const brokerPercentage = parseFloat(newTransaction.brokerPercentage);
      const depositAmount = saleAmount * (1 + salePercentage / 100);
      transactionToSave.depositAmount = depositAmount;
      transactionToSave.depositAccount = newTransaction.depositAccount;
      transactionToSave.brokerCommission = brokerCommissionAmount;
      transactionToSave.profit = (saleAmount * (salePercentage / 100)) - brokerCommissionAmount;
      transactionToSave.salePrice = saleAmount * (1 + salePercentage / 100);
      transactionToSave.status = 'completed';
      transactionToSave.usedInOrder = false;
    } else if (newTransaction.type === 'order') {
      transactionToSave.status = 'pending';
      transactionToSave.deposits = [];
      transactionToSave.profit = null;
      transactionToSave.salePrice = null;
      transactionToSave.salePercentage = null;
      transactionToSave.brokerId = null;
      transactionToSave.brokerPercentage = null;
      transactionToSave.depositAmount = null;
      transactionToSave.depositAccount = null;
    }

    onAddTransaction(transactionToSave);
    setShowModal(false);
    setNewTransaction({
      type: 'sale',
      amount: '',
      purchasePrice: '',
      salePercentage: '',
      clientId: '',
      supplierId: '',
      brokerId: '',
      brokerPercentage: '',
      branchId: '',
      fundSource: 'own',
      status: 'pending',
      depositAmount: '',
      depositAccount: 'Firsbel',
    });
  };

  const handleMarkDelivered = (transactionId) => {
    setDeliveryModal({ show: true, transactionId });
  };

  const handleConfirmDelivery = () => {
    onMarkAsDelivered(deliveryModal.transactionId, proofFile);
    setDeliveryModal({ show: false, transactionId: null });
    setProofFile(null);
  };

  const handleViewProof = (proofName) => {
    setViewProofModal({ show: true, proofName });
  };

  const handleCancelOrder = (transactionId) => {
    setCancelModal({ show: true, transactionId });
  };

  const handleConfirmCancel = (transactionId) => {
    onCancelOrder(transactionId);
    setCancelModal({ show: false, transactionId: null });
  };

  const availableOwnFunds = ownFundsLimit - committedOwnFunds;
  const isOwnFundsExceeded = newTransaction.type === 'order' && newTransaction.fundSource === 'own' && parseFloat(newTransaction.amount) > availableOwnFunds;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Operaciones</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Operación
        </button>
      </div>

      {/* Panel de saldo Firsbel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Saldo Acumulado en Firsbel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">${firsbelBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Saldo Disponible</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">8,000,000</p>
            <p className="text-sm text-gray-600">Mínimo para Pedido</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">10,000,000</p>
            <p className="text-sm text-gray-600">Fondo Propio Mínimo</p>
          </div>
        </div>
        {firsbelBalance >= 8000000 ? (
          <p className="mt-4 text-sm text-green-600 font-medium">¡Saldo suficiente para hacer un pedido!</p>
        ) : (
          <p className="mt-4 text-sm text-red-600 font-medium">Saldo insuficiente. Faltan ${((8000000 - firsbelBalance).toLocaleString())}</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          <div className="flex space-x-2">
            {['all', 'sale', 'order'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === type
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Todas' : type === 'sale' ? 'Ventas' : 'Pedidos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depósito</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta Dep.</th>
              <th className="px-6 py-3 text-left text-xs font-medium