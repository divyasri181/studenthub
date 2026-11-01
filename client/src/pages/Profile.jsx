import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  DollarSign,
  KeyRound,
  Save,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 6000);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        college,
        currency,
        monthlyBudget: Number(monthlyBudget),
      };
      if (newPassword.trim()) {
        if (newPassword.length < 6) {
          showToast('Password must be at least 6 characters long', 'error');
          setLoading(false);
          return;
        }
        payload.password = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.success && res.data) {
        updateUser(res.data);
        showToast('Profile updated successfully!', 'success');
        setNewPassword('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Profile Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information, department details & target budget
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Avatar Card */}
        <div className="app-card p-6 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {user?.name || 'Student Name'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.email}
          </p>
          <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            {user?.college || 'Diploma CSE Student'}
          </span>
        </div>

        {/* Right: Profile Form */}
        <div className="app-card p-6 md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input !pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="form-input !pl-10 bg-slate-100 dark:bg-slate-800 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">College / Department</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="form-input !pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Currency Symbol</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-input"
                >
                  <option value="₹">₹ (Indian Rupee - INR)</option>
                  <option value="$">$ (US Dollar - USD)</option>
                  <option value="€">€ (Euro - EUR)</option>
                  <option value="£">£ (British Pound - GBP)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Default Monthly Budget (₹)</label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="form-label">
                Change Password (Leave blank to keep unchanged)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input !pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
