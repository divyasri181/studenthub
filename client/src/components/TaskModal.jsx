import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useNotification } from '../context/NotificationContext';
import { taskService } from '../services/taskService';
import { Loader2 } from 'lucide-react';

const TASK_TYPES = ['Assignment', 'Project', 'Exam Prep', 'Personal Task', 'Study Session'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const TaskModal = ({ isOpen, onClose, taskToEdit, onTaskSaved }) => {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: 'Assignment',
    priority: 'Medium',
    dueDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        subject: taskToEdit.subject || '',
        type: taskToEdit.type || 'Assignment',
        priority: taskToEdit.priority || 'Medium',
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
        description: taskToEdit.description || '',
      });
    } else {
      // Default due date = tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        subject: '',
        type: 'Assignment',
        priority: 'Medium',
        dueDate: tomorrow.toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date / deadline is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (taskToEdit) {
        const id = taskToEdit._id || taskToEdit.id;
        const res = await taskService.updateTask(id, formData);
        showToast('Task updated successfully!', 'success');
        onTaskSaved(res.data);
      } else {
        const res = await taskService.createTask(formData);
        showToast('Task created successfully!', 'success');
        onTaskSaved(res.data);
      }
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task / Assignment' : 'Create Assignment or Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="form-label">Task / Assignment Title *</label>
          <input
            type="text"
            placeholder="e.g. DBMS Lab Record, Java Project, Quiz 2"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`form-input ${errors.title ? 'border-rose-500 focus:ring-rose-500' : ''}`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Subject & Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Subject / Course Name</label>
            <input
              type="text"
              placeholder="e.g. Computer Networks, DSA"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Task Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="form-input"
            >
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="form-input"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Due Date / Deadline *</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`form-input ${errors.dueDate ? 'border-rose-500 focus:ring-rose-500' : ''}`}
            />
            {errors.dueDate && <p className="text-xs text-rose-500 mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Instructions / Description</label>
          <textarea
            rows="3"
            placeholder="Add assignment guidelines, requirements, or links..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : taskToEdit ? (
              'Save Changes'
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
