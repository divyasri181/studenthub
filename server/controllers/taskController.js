const dbStore = require('../config/store');

// @desc    Get all tasks for logged in user (with filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { status, priority, type, search } = req.query;

    const tasks = await dbStore.getTasks(userId, {
      status,
      priority,
      type,
      search,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const task = await dbStore.getTaskById(req.params.id, userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task / assignment
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, description, type, subject, priority, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title and deadline/due date',
      });
    }

    const task = await dbStore.createTask({
      user: userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      type: type || 'Assignment',
      subject: subject ? subject.trim() : 'General',
      priority: priority || 'Medium',
      dueDate: new Date(dueDate).toISOString(),
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, description, type, subject, priority, dueDate, completed } = req.body;

    const existing = await dbStore.getTaskById(req.params.id, userId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updates = {};
    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (type) updates.type = type;
    if (subject !== undefined) updates.subject = subject.trim();
    if (priority) updates.priority = priority;
    if (dueDate) updates.dueDate = new Date(dueDate).toISOString();
    if (completed !== undefined) updates.completed = Boolean(completed);

    const updated = await dbStore.updateTask(req.params.id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completed status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskCompletion = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const existing = await dbStore.getTaskById(req.params.id, userId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updated = await dbStore.updateTask(req.params.id, userId, {
      completed: !existing.completed,
    });

    res.status(200).json({
      success: true,
      message: updated.completed ? 'Task marked as completed' : 'Task marked as pending',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const deleted = await dbStore.deleteTask(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics & upcoming deadlines
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const allTasks = await dbStore.getTasks(userId);

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const now = new Date();
    // Overdue pending tasks
    const overdue = allTasks.filter(
      (t) => !t.completed && new Date(t.dueDate) < now
    ).length;

    // Due in next 3 days
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const dueSoon = allTasks.filter(
      (t) =>
        !t.completed &&
        new Date(t.dueDate) >= now &&
        new Date(t.dueDate) <= threeDaysLater
    );

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        completionRate,
        overdue,
        dueSoonCount: dueSoon.length,
        upcomingTasks: dueSoon.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  getTaskStats,
};
