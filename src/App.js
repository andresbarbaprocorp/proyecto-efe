import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Suppliers from './components/Suppliers';
import Brokers from './components/Brokers';
import Branches from './components/Branches';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import PurchaseManagement from './components/PurchaseManagement';
import PendingCashCalendar from './components/PendingCashCalendar';
import SaldosCuentas from './components/SaldosCuentas';
import { mockUsers, mockBranches, mockClients, mockSuppliers, mockBrokers, mockTransactions, OWN_FUNDS_LIMIT } from './mockData';

function App() {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [branches, setBranches] = useState(mockBranches);
  const [clients, setClients] = useState(mockClients);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [brokers, setBrokers] = useState(mockBrokers);
  const [transactions, setTransactions] = useState(mockTransactions);

  // Función para añadir una nueva transacción
  const handleAddTransaction = (newTrans) => {
    setTransactions(prevTransactions => [...prevTransactions, newTrans]);
  };

  // Función para actualizar depósitos de una transacción de tipo 'order'
  const handleUpdateTransactionDeposits = (transactionId, newDeposits) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(trans => 
        trans.id === transactionId ? { ...trans, deposits: newDeposits } : trans
      )
    );
  };

  // Función para marcar pedido como entregado
  const handleMarkAsDelivered = (transactionId, proofFile) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(trans => 
        trans.id === transactionId 
          ? { 
              ...trans, 
              status: 'delivered', 
              deliveryProof: proofFile ? proofFile.name : null,
              deliveredDate: new Date().toISOString().split('T')[0]
            } 
          : trans
      )
    );
  };

  // Nueva función para cancelar pedido
  const handleCancelOrder = (transactionId) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(trans => 
        trans.id === transactionId 
          ? { ...trans, status: 'cancelled', cancelledDate: new Date().toISOString().split('T')[0] }
          : trans
      )
    );
  };

  // Función para actualizar proveedores
  const handleUpdateSupplier = (updatedSupplier) => {
    setSuppliers(prevSuppliers => 
      prevSuppliers.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
  };

  // Calcular fondos propios comprometidos
  const committedOwnFunds = transactions.reduce((sum, trans) => {
    if (trans.type === 'order' && trans.fundSource === 'own' && trans.status === 'pending') {
      return sum + trans.amount;
    }
    return sum;
  }, 0);

  // Filtrar transacciones según el usuario
  const getUserTransactions = () => {
    if (currentUser.role === 'admin') {
      return transactions;
    } else {
      return transactions.filter(t => t.branchId === currentUser.branchId);
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar currentUser={currentUser} />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard transactions={getUserTransactions()} branches={branches} currentUser={currentUser} />} />
            <Route path="/clients" element={<Clients clients={clients} transactions={getUserTransactions()} />} />
            <Route path="/suppliers" element={<Suppliers suppliers={suppliers} onUpdateSupplier={handleUpdateSupplier} />} />
            <Route path="/brokers" element={<Brokers brokers={brokers} transactions={getUserTransactions()} />} />
            <Route path="/branches" element={<Branches branches={branches} currentUser={currentUser} />} />
            <Route 
              path="/transactions" 
              element={
                <Transactions 
                  transactions={getUserTransactions()} 
                  clients={clients} 
                  suppliers={suppliers} 
                  brokers={brokers} 
                  branches={branches} 
                  onAddTransaction={handleAddTransaction}
                  onUpdateTransactionDeposits={handleUpdateTransactionDeposits}
                  onMarkAsDelivered={handleMarkAsDelivered}
                  onCancelOrder={handleCancelOrder} // Pasar función de cancelar
                  committedOwnFunds={committedOwnFunds}
                  ownFundsLimit={OWN_FUNDS_LIMIT}
                />
              } 
            />
            <Route 
              path="/purchase-management" 
              element={
                <PurchaseManagement 
                  transactions={getUserTransactions()} 
                  suppliers={suppliers} 
                  onUpdateTransactionDeposits={handleUpdateTransactionDeposits}
                />
              } 
            />
            <Route 
              path="/pending-cash-calendar" 
              element={
                <PendingCashCalendar 
                  transactions={getUserTransactions()} 
                  suppliers={suppliers}
                />
              } 
            />
            <Route 
              path="/saldos-cuentas" 
              element={
                <SaldosCuentas 
                  transactions={getUserTransactions()} 
                  suppliers={suppliers} 
                  onAddTransaction={handleAddTransaction}
                />
              } 
            />
            <Route path="/reports" element={<Reports transactions={getUserTransactions()} branches={branches} brokers={brokers} clients={clients} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;