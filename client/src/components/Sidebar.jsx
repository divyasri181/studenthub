import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  CheckSquare,
  PieChart,
  BarChart3,
  User,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationLinks = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Expense Tracker', path: '/expenses', icon: ReceiptText },
  { name: 'Task Manager', path: '/tasks', icon: CheckSquare },
  { name: 'Budget Planner', path: '/budget', icon: PieChart },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { name: 'My Profile', path: '/profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                StudentHub
              </h1>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold tracking-wide uppercase">
                Expense & Tasks
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Tag / Badge */}
        <div className="px-6 py-3.5 bg-purple-50/60 dark:bg-purple-950/20 border-b border-purple-100/60 dark:border-purple-900/20">
          <p className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            Workspace
          </p>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
            {user?.college || 'Diploma in CSE'}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800/60 hover:text-purple-600 dark:hover:text-purple-300'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-sm flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                  {user?.name || 'Student User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'student@edu'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
