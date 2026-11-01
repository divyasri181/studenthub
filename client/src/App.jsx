import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExpenseModal from './components/ExpenseModal';
import TaskModal from './components/TaskModal';

// Pages
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Tasks from './pages/Tasks';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Loading StudentHub...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Main App Layout for Authenticated Pages
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenAddExpense = () => {
    setExpenseToEdit(null);
    setExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setExpenseModalOpen(true);
  };

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddExpense={handleOpenAddExpense}
          onOpenAddTask={handleOpenAddTask}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  key={`dash_${refreshTrigger}`}
                  onOpenAddExpense={handleOpenAddExpense}
                  onOpenAddTask={handleOpenAddTask}
                />
              }
            />
            <Route
              path="/expenses"
              element={
                <Expenses
                  key={`exp_${refreshTrigger}`}
                  onOpenAddExpense={handleOpenAddExpense}
                  onEditExpense={handleOpenEditExpense}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <Tasks
                  key={`task_${refreshTrigger}`}
                  onOpenAddTask={handleOpenAddTask}
                  onEditTask={handleOpenEditTask}
                />
              }
            />
            <Route path="/budget" element={<Budget key={`budget_${refreshTrigger}`} />} />
            <Route path="/reports" element={<Reports key={`rep_${refreshTrigger}`} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals for Add/Edit */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        expenseToEdit={expenseToEdit}
        onExpenseSaved={triggerRefresh}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        onTaskSaved={triggerRefresh}
      />
    </div>
  );
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !loading && isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          !loading && isAuthenticated ? <Navigate to="/" replace /> : <Register />
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
