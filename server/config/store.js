const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { isUsingMongo } = require('./db');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Task = require('../models/Task');
const Budget = require('../models/Budget');

const DB_FILE = path.join(__dirname, '../data/student_db.json');

// Ensure database file exists
const initDbFile = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      expenses: [],
      tasks: [],
      budgets: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

const readLocalData = () => {
  initDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return { users: [], expenses: [], tasks: [], budgets: [] };
  }
};

const writeLocalData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36)
  );
};

// Store Interface that delegates to Mongoose if available, or local JSON store
const dbStore = {
  // ---- USER METHODS ----
  async findUserByEmail(email) {
    if (isUsingMongo()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const data = readLocalData();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isUsingMongo()) {
      return await User.findById(id).select('-password');
    }
    const data = readLocalData();
    const user = data.users.find((u) => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser({ name, email, password, college, currency, monthlyBudget }) {
    if (isUsingMongo()) {
      return await User.create({ name, email, password, college, currency, monthlyBudget });
    }
    const data = readLocalData();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
      _id: generateId(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college: college || 'Diploma in Computer Science & Engineering',
      currency: currency || '₹',
      monthlyBudget: monthlyBudget || 6000,
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    writeLocalData(data);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, updates) {
    if (isUsingMongo()) {
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }
      return await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    }
    const data = readLocalData();
    const index = data.users.findIndex((u) => u._id === id || u.id === id);
    if (index === -1) return null;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    data.users[index] = {
      ...data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeLocalData(data);
    const { password: _, ...safeUser } = data.users[index];
    return safeUser;
  },

  async matchPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // ---- EXPENSE METHODS ----
  async getExpenses(userId, { category, search, startDate, endDate, month } = {}) {
    if (isUsingMongo()) {
      let query = { user: userId };
      if (category && category !== 'All') query.category = category;
      if (search) query.title = { $regex: search, $options: 'i' };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      } else if (month) {
        const start = new Date(`${month}-01T00:00:00.000Z`);
        const [year, m] = month.split('-').map(Number);
        const end = new Date(year, m, 0, 23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
      }
      return await Expense.find(query).sort({ date: -1, createdAt: -1 });
    }

    const data = readLocalData();
    let expenses = data.expenses.filter((e) => String(e.user) === String(userId));

    if (category && category !== 'All') {
      expenses = expenses.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      expenses = expenses.filter((e) => e.title.toLowerCase().includes(q) || (e.notes && e.notes.toLowerCase().includes(q)));
    }

    if (startDate) {
      expenses = expenses.filter((e) => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
      const eDate = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      expenses = expenses.filter((e) => new Date(e.date) <= eDate);
    } else if (month) {
      expenses = expenses.filter((e) => {
        const d = new Date(e.date);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return ym === month;
      });
    }

    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getExpenseById(id, userId) {
    if (isUsingMongo()) {
      return await Expense.findOne({ _id: id, user: userId });
    }
    const data = readLocalData();
    return data.expenses.find((e) => (e._id === id || e.id === id) && String(e.user) === String(userId)) || null;
  },

  async createExpense(expenseData) {
    if (isUsingMongo()) {
      return await Expense.create(expenseData);
    }
    const data = readLocalData();
    const newExpense = {
      _id: generateId(),
      ...expenseData,
      amount: Number(expenseData.amount),
      date: expenseData.date ? new Date(expenseData.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.expenses.push(newExpense);
    writeLocalData(data);
    return newExpense;
  },

  async updateExpense(id, userId, updates) {
    if (isUsingMongo()) {
      return await Expense.findOneAndUpdate(
        { _id: id, user: userId },
        updates,
        { new: true, runValidators: true }
      );
    }
    const data = readLocalData();
    const index = data.expenses.findIndex((e) => (e._id === id || e.id === id) && String(e.user) === String(userId));
    if (index === -1) return null;

    if (updates.amount) updates.amount = Number(updates.amount);
    if (updates.date) updates.date = new Date(updates.date).toISOString();

    data.expenses[index] = {
      ...data.expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeLocalData(data);
    return data.expenses[index];
  },

  async deleteExpense(id, userId) {
    if (isUsingMongo()) {
      return await Expense.findOneAndDelete({ _id: id, user: userId });
    }
    const data = readLocalData();
    const index = data.expenses.findIndex((e) => (e._id === id || e.id === id) && String(e.user) === String(userId));
    if (index === -1) return null;
    const [deleted] = data.expenses.splice(index, 1);
    writeLocalData(data);
    return deleted;
  },

  // ---- TASK METHODS ----
  async getTasks(userId, { status, priority, type, search } = {}) {
    if (isUsingMongo()) {
      let query = { user: userId };
      if (status === 'completed') query.completed = true;
      if (status === 'pending') query.completed = false;
      if (priority && priority !== 'All') query.priority = priority;
      if (type && type !== 'All') query.type = type;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      return await Task.find(query).sort({ completed: 1, dueDate: 1 });
    }

    const data = readLocalData();
    let tasks = data.tasks.filter((t) => String(t.user) === String(userId));

    if (status === 'completed') tasks = tasks.filter((t) => t.completed === true);
    if (status === 'pending') tasks = tasks.filter((t) => t.completed === false);
    if (priority && priority !== 'All') tasks = tasks.filter((t) => t.priority === priority);
    if (type && type !== 'All') tasks = tasks.filter((t) => t.type === type);

    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.subject && t.subject.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort: incomplete first, then by earliest dueDate
    return tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  },

  async getTaskById(id, userId) {
    if (isUsingMongo()) {
      return await Task.findOne({ _id: id, user: userId });
    }
    const data = readLocalData();
    return data.tasks.find((t) => (t._id === id || t.id === id) && String(t.user) === String(userId)) || null;
  },

  async createTask(taskData) {
    if (isUsingMongo()) {
      return await Task.create(taskData);
    }
    const data = readLocalData();
    const newTask = {
      _id: generateId(),
      ...taskData,
      completed: Boolean(taskData.completed) || false,
      completedAt: taskData.completed ? new Date().toISOString() : null,
      dueDate: new Date(taskData.dueDate).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    writeLocalData(data);
    return newTask;
  },

  async updateTask(id, userId, updates) {
    if (isUsingMongo()) {
      if (updates.completed !== undefined) {
        updates.completedAt = updates.completed ? new Date() : null;
      }
      return await Task.findOneAndUpdate(
        { _id: id, user: userId },
        updates,
        { new: true, runValidators: true }
      );
    }
    const data = readLocalData();
    const index = data.tasks.findIndex((t) => (t._id === id || t.id === id) && String(t.user) === String(userId));
    if (index === -1) return null;

    if (updates.completed !== undefined) {
      updates.completedAt = updates.completed ? new Date().toISOString() : null;
    }
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate).toISOString();
    }

    data.tasks[index] = {
      ...data.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeLocalData(data);
    return data.tasks[index];
  },

  async deleteTask(id, userId) {
    if (isUsingMongo()) {
      return await Task.findOneAndDelete({ _id: id, user: userId });
    }
    const data = readLocalData();
    const index = data.tasks.findIndex((t) => (t._id === id || t.id === id) && String(t.user) === String(userId));
    if (index === -1) return null;
    const [deleted] = data.tasks.splice(index, 1);
    writeLocalData(data);
    return deleted;
  },

  // ---- BUDGET METHODS ----
  async getBudget(userId, month) {
    if (isUsingMongo()) {
      return await Budget.findOne({ user: userId, month });
    }
    const data = readLocalData();
    return data.budgets.find((b) => String(b.user) === String(userId) && b.month === month) || null;
  },

  async setBudget(userId, { month, totalBudget, categoryBudgets, alertThreshold }) {
    if (isUsingMongo()) {
      return await Budget.findOneAndUpdate(
        { user: userId, month },
        {
          totalBudget: Number(totalBudget),
          categoryBudgets: categoryBudgets || {},
          alertThreshold: alertThreshold || 80,
        },
        { new: true, upsert: true, runValidators: true }
      );
    }
    const data = readLocalData();
    let index = data.budgets.findIndex((b) => String(b.user) === String(userId) && b.month === month);

    const budgetDoc = {
      _id: index >= 0 ? data.budgets[index]._id : generateId(),
      user: userId,
      month,
      totalBudget: Number(totalBudget),
      categoryBudgets: categoryBudgets || {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        Education: 0,
        Entertainment: 0,
        Others: 0,
      },
      alertThreshold: Number(alertThreshold) || 80,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      data.budgets[index] = budgetDoc;
    } else {
      budgetDoc.createdAt = new Date().toISOString();
      data.budgets.push(budgetDoc);
    }
    writeLocalData(data);
    return budgetDoc;
  },

  // Direct access for seed script or reset
  resetData(seededData) {
    writeLocalData(seededData);
  },
  getLocalData() {
    return readLocalData();
  }
};

module.exports = dbStore;
