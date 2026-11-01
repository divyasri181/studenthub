import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  BookOpen,
  Edit2,
  Trash2,
  Loader2,
  ListFilter,
  CheckCircle2,
  LayoutGrid,
  List,
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { formatDate, getDeadlineStatus, getPriorityBadge } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';

const PRIORITIES = ['All', 'Urgent', 'High', 'Medium', 'Low'];
const TYPES = ['All', 'Assignment', 'Project', 'Exam Prep', 'Personal Task', 'Study Session'];

const Tasks = ({ onOpenAddTask, onEditTask }) => {
  const { showToast } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all'); // 'all' | 'pending' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusTab !== 'all') params.status = statusTab;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (typeFilter !== 'All') params.type = typeFilter;
      if (search) params.search = search;

      const res = await taskService.getTasks(params);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusTab, priorityFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleToggleTask = async (task) => {
    try {
      const id = task._id || task.id;
      const res = await taskService.toggleTask(id);
      showToast(res.message, 'success');
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? res.data : t))
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      const id = taskToDelete._id || taskToDelete.id;
      await taskService.deleteTask(id);
      showToast('Task removed successfully', 'success');
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      setTaskToDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && new Date(t.dueDate) < new Date()).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task & Assignment Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize coursework deadlines, lab submissions & study goals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddTask}
            className="btn-primary !py-2 !px-3.5 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="app-card p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            All Tasks
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalCount}
          </h3>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">
            Pending
          </p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {pendingCount}
          </h3>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
            Completed
          </p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {completedCount}
          </h3>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">
            Overdue
          </p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {overdueCount}
          </h3>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="app-card p-4 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  statusTab === tab.id
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input !pl-9 !py-1.5 text-xs sm:text-sm"
            />
          </form>
        </div>

        {/* Priority & Type filter pills */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Priority:</span>
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  priorityFilter === p
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Type:</span>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === t
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Content: List View or Grid View */}
      {loading ? (
        <div className="app-card py-16 text-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-purple-600" />
          <span className="text-sm">Loading tasks & assignments...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="app-card py-16 text-center">
          <CheckSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No tasks found
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You don't have any tasks matching the current filter. Click "New Assignment" to add one!
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-2.5">
          {tasks.map((task) => {
            const deadline = getDeadlineStatus(task.dueDate, task.completed);
            const priorityBadge = getPriorityBadge(task.priority);

            return (
              <div
                key={task._id || task.id}
                className={`app-card p-4 transition-all hover:border-purple-300 dark:hover:border-purple-800 flex items-start sm:items-center justify-between gap-4 ${
                  task.completed ? 'opacity-70 bg-slate-50/60 dark:bg-slate-900/40' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`mt-0.5 sm:mt-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                      task.completed
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-purple-600'
                    }`}
                    title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate ${
                          task.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {task.type}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {task.subject || 'General'}
                      </span>
                      <span>•</span>
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${deadline.color}`}>
                    {deadline.label}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                      title="Edit Task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const deadline = getDeadlineStatus(task.dueDate, task.completed);
            const priorityBadge = getPriorityBadge(task.priority);

            return (
              <div
                key={task._id || task.id}
                className={`app-card p-5 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-all ${
                  task.completed ? 'opacity-70 bg-slate-50/60 dark:bg-slate-900/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-lg">
                      {task.subject || 'General'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h4
                    className={`font-bold text-base text-slate-900 dark:text-white mb-1.5 ${
                      task.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${deadline.color}`}>
                    {deadline.label}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        task.completed
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-purple-600 text-slate-400'
                      }`}
                      title={task.completed ? 'Mark pending' : 'Mark completed'}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to remove "${taskToDelete?.title}"?`}
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Tasks;
