// Rich in-browser database engine for standalone Vercel / offline demo mode
const STORAGE_KEY_USER = 'mock_student_user';
const STORAGE_KEY_EXPENSES = 'mock_student_expenses';
const STORAGE_KEY_TASKS = 'mock_student_tasks';
const STORAGE_KEY_BUDGET = 'mock_student_budget';

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const daysAhead = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const initialUser = {
  _id: 'demo_user_101',
  name: 'Alex Johnson',
  email: 'alex.student@polytechnic.edu',
  college: 'Government Polytechnic - Diploma in Computer Science & Engineering',
  currency: '₹',
  monthlyBudget: 6500,
  token: 'mock_jwt_token_demo_mode_2026',
};

const initialExpenses = [
  {
    _id: 'exp_1',
    title: 'Canteen Lunch & Chai',
    amount: 140,
    category: 'Food',
    paymentMethod: 'UPI',
    date: daysAgo(0),
    notes: 'Lunch with batchmates after Computer Networks lab',
  },
  {
    _id: 'exp_2',
    title: 'Data Structures Reference Book',
    amount: 520,
    category: 'Education',
    paymentMethod: 'Debit Card',
    date: daysAgo(1),
    notes: 'Algorithms reference textbook',
  },
  {
    _id: 'exp_3',
    title: 'Monthly College Bus & Metro Pass',
    amount: 650,
    category: 'Travel',
    paymentMethod: 'UPI',
    date: daysAgo(3),
    notes: 'Monthly concession travel card',
  },
  {
    _id: 'exp_4',
    title: 'Hostel Mess Food Fee Advance',
    amount: 2200,
    category: 'Food',
    paymentMethod: 'Net Banking',
    date: daysAgo(5),
    notes: 'Monthly mess charges',
  },
  {
    _id: 'exp_5',
    title: 'Project Prints & Spiral Binding',
    amount: 180,
    category: 'Education',
    paymentMethod: 'Cash',
    date: daysAgo(6),
    notes: 'Web Technology lab documentation',
  },
  {
    _id: 'exp_6',
    title: 'Weekend Movie & Snacks',
    amount: 320,
    category: 'Entertainment',
    paymentMethod: 'UPI',
    date: daysAgo(8),
    notes: 'Cinema with CSE classmates',
  },
  {
    _id: 'exp_7',
    title: 'College Fest T-Shirt & Badge',
    amount: 380,
    category: 'Shopping',
    paymentMethod: 'UPI',
    date: daysAgo(11),
    notes: 'Annual tech fest merchandise',
  },
  {
    _id: 'exp_8',
    title: '5G Student Data Recharge (30 Days)',
    amount: 299,
    category: 'Others',
    paymentMethod: 'UPI',
    date: daysAgo(14),
    notes: 'For online lectures and GitHub code sync',
  },
  {
    _id: 'exp_9',
    title: 'Engineering Drawing Pens & Record Sheets',
    amount: 190,
    category: 'Education',
    paymentMethod: 'Cash',
    date: daysAgo(16),
    notes: 'Lab record submission supplies',
  },
  {
    _id: 'exp_10',
    title: 'Evening Coffee & Samosas during Study',
    amount: 95,
    category: 'Food',
    paymentMethod: 'UPI',
    date: daysAgo(18),
    notes: 'Group study session snacks',
  },
];

const initialTasks = [
  {
    _id: 'task_1',
    title: 'Computer Networks - Socket Programming Lab Record',
    description: 'Complete TCP/UDP client-server socket code and output screenshots in the lab manual.',
    type: 'Assignment',
    subject: 'Computer Networks',
    priority: 'High',
    dueDate: daysAhead(1),
    completed: false,
  },
  {
    _id: 'task_2',
    title: 'DBMS - SQL Mini Project with Normalization',
    description: 'Design ER Diagram, 3NF schema, and sample SQL queries for Hospital Management System.',
    type: 'Project',
    subject: 'Database Systems',
    priority: 'Urgent',
    dueDate: daysAhead(3),
    completed: false,
  },
  {
    _id: 'task_3',
    title: 'Operating Systems - Semaphore & Deadlock Seminar Prep',
    description: 'Prepare 10-slide PowerPoint presentation on Banker Algorithm for Deadlock Avoidance.',
    type: 'Exam Prep',
    subject: 'Operating Systems',
    priority: 'Medium',
    dueDate: daysAhead(5),
    completed: false,
  },
  {
    _id: 'task_4',
    title: 'Data Structures - Implement AVL Tree in C++',
    description: 'Write functions for Left-Rotate, Right-Rotate, Insertion, and Inorder Traversal.',
    type: 'Assignment',
    subject: 'Data Structures',
    priority: 'High',
    dueDate: daysAhead(7),
    completed: false,
  },
  {
    _id: 'task_5',
    title: 'Renew Semester Library Books (Operating System Concepts)',
    description: 'Visit Central Library to renew Galvin textbook before penalty date.',
    type: 'Personal Task',
    subject: 'General',
    priority: 'Low',
    dueDate: daysAhead(2),
    completed: false,
  },
  {
    _id: 'task_6',
    title: 'Web Technology - Build Responsive Portfolio Site',
    description: 'Created dynamic HTML5, Tailwind CSS, and JavaScript portfolio.',
    type: 'Project',
    subject: 'Web Technologies',
    priority: 'Medium',
    dueDate: daysAgo(2),
    completed: true,
  },
  {
    _id: 'task_7',
    title: 'Python Lab - Recursive Fibonacci & Factorial',
    description: 'Verified test cases and submitted to professor via Google Classroom.',
    type: 'Assignment',
    subject: 'Python Programming',
    priority: 'Low',
    dueDate: daysAgo(4),
    completed: true,
  },
];

// Helper to seed localStorage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_EXPENSES)) {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(initialExpenses));
  }
  if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(initialTasks));
  }
  if (!localStorage.getItem(STORAGE_KEY_BUDGET)) {
    localStorage.setItem(
      STORAGE_KEY_BUDGET,
      JSON.stringify({
        totalBudget: 6500,
        alertThreshold: 80,
      })
    );
  }
};

initStorage();

export const mockStorage = {
  // Auth
  demoLogin() {
    initStorage();
    return {
      success: true,
      data: initialUser,
    };
  },

  login(credentials) {
    initStorage();
    return {
      success: true,
      data: {
        ...initialUser,
        email: credentials.email || initialUser.email,
        name: credentials.email ? credentials.email.split('@')[0] : initialUser.name,
      },
    };
  },

  register(userData) {
    initStorage();
    const user = {
      _id: 'user_' + Date.now(),
      name: userData.name,
      email: userData.email,
      college: userData.college || initialUser.college,
      currency: '₹',
      monthlyBudget: Number(userData.monthlyBudget) || 6000,
      token: 'mock_jwt_' + Date.now(),
    };
    return {
      success: true,
      data: user,
    };
  },

  getMe() {
    initStorage();
    const saved = localStorage.getItem('smart_student_user');
    return {
      success: true,
      data: saved ? JSON.parse(saved) : initialUser,
    };
  },

  updateProfile(updates) {
    const saved = localStorage.getItem('smart_student_user');
    const user = saved ? JSON.parse(saved) : initialUser;
    const updated = { ...user, ...updates };
    return {
      success: true,
      data: updated,
    };
  },

  // Expenses
  getExpenses(params = {}) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    if (params.category && params.category !== 'All') {
      list = list.filter((e) => e.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || (e.notes && e.notes.toLowerCase().includes(q))
      );
    }
    if (params.startDate) {
      list = list.filter((e) => new Date(e.date) >= new Date(params.startDate));
    }
    if (params.endDate) {
      const end = new Date(new Date(params.endDate).setHours(23, 59, 59, 999));
      list = list.filter((e) => new Date(e.date) <= end);
    }
    return {
      success: true,
      count: list.length,
      data: list.sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
  },

  createExpense(data) {
    initStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const newExp = {
      _id: 'exp_' + Date.now(),
      ...data,
      amount: Number(data.amount),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };
    list.unshift(newExp);
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(list));
    return { success: true, data: newExp };
  },

  updateExpense(id, data) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const index = list.findIndex((e) => (e._id || e.id) === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...data, amount: Number(data.amount) || list[index].amount };
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(list));
      return { success: true, data: list[index] };
    }
    return { success: false, message: 'Expense not found' };
  },

  deleteExpense(id) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    list = list.filter((e) => (e._id || e.id) !== id);
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(list));
    return { success: true };
  },

  getExpenseStats() {
    initStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const now = new Date();
    let totalAllTime = 0;
    let totalThisMonth = 0;
    const catMap = { Food: 0, Travel: 0, Shopping: 0, Education: 0, Entertainment: 0, Others: 0 };

    list.forEach((e) => {
      const amt = Number(e.amount) || 0;
      totalAllTime += amt;
      const d = new Date(e.date);
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        totalThisMonth += amt;
        const cat = e.category || 'Others';
        catMap[cat] = (catMap[cat] || 0) + amt;
      }
    });

    return {
      success: true,
      data: {
        totalAllTime,
        totalThisMonth,
        countThisMonth: list.length,
        categoryBreakdown: catMap,
      },
    };
  },

  // Tasks
  getTasks(params = {}) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    if (params.status === 'completed') list = list.filter((t) => t.completed);
    if (params.status === 'pending') list = list.filter((t) => !t.completed);
    if (params.priority && params.priority !== 'All') list = list.filter((t) => t.priority === params.priority);
    if (params.type && params.type !== 'All') list = list.filter((t) => t.type === params.type);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.subject && t.subject.toLowerCase().includes(q))
      );
    }
    return {
      success: true,
      count: list.length,
      data: list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }),
    };
  },

  createTask(data) {
    initStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const newTask = {
      _id: 'task_' + Date.now(),
      ...data,
      completed: false,
      dueDate: new Date(data.dueDate).toISOString(),
    };
    list.unshift(newTask);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(list));
    return { success: true, data: newTask };
  },

  updateTask(id, data) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const index = list.findIndex((t) => (t._id || t.id) === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...data };
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(list));
      return { success: true, data: list[index] };
    }
    return { success: false, message: 'Task not found' };
  },

  toggleTask(id) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const index = list.findIndex((t) => (t._id || t.id) === id);
    if (index >= 0) {
      list[index].completed = !list[index].completed;
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(list));
      return {
        success: true,
        message: list[index].completed ? 'Task marked as completed' : 'Task marked as pending',
        data: list[index],
      };
    }
    return { success: false, message: 'Task not found' };
  },

  deleteTask(id) {
    initStorage();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    list = list.filter((t) => (t._id || t.id) !== id);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(list));
    return { success: true };
  },

  getTaskStats() {
    initStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const total = list.length;
    const completed = list.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const now = new Date();
    const overdue = list.filter((t) => !t.completed && new Date(t.dueDate) < now).length;
    const dueSoon = list.filter((t) => !t.completed && new Date(t.dueDate) >= now).slice(0, 5);

    return {
      success: true,
      data: {
        total,
        completed,
        pending,
        completionRate,
        overdue,
        dueSoonCount: dueSoon.length,
        upcomingTasks: dueSoon,
      },
    };
  },

  // Budget
  getBudgetStatus(requestedMonth) {
    initStorage();
    const budgetConfig = JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGET) || '{"totalBudget":6500,"alertThreshold":80}');
    const expenses = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const totalBudget = budgetConfig.totalBudget || 6500;
    const alertThreshold = budgetConfig.alertThreshold || 80;
    const remaining = totalBudget - totalSpent;
    const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - now.getDate() + 1);
    const dailyBudgetRemaining = remaining > 0 ? Math.round(remaining / daysRemaining) : 0;

    let status = 'normal';
    let alertMessage = null;
    if (percentageUsed >= 100) {
      status = 'exceeded';
      alertMessage = `You have exceeded your monthly budget by ₹${Math.abs(remaining).toLocaleString()}!`;
    } else if (percentageUsed >= alertThreshold) {
      status = 'warning';
      alertMessage = `Warning: You have used ${percentageUsed}% of your monthly budget.`;
    }

    const catMap = { Food: 0, Travel: 0, Shopping: 0, Education: 0, Entertainment: 0, Others: 0 };
    expenses.forEach((e) => {
      const cat = e.category || 'Others';
      catMap[cat] = (catMap[cat] || 0) + (Number(e.amount) || 0);
    });

    return {
      success: true,
      data: {
        totalBudget,
        totalSpent,
        remaining,
        percentageUsed,
        daysRemaining,
        dailyBudgetRemaining,
        alertThreshold,
        status,
        alertMessage,
        categorySpent: catMap,
      },
    };
  },

  setBudget(data) {
    initStorage();
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGET) || '{}');
    const updated = {
      ...current,
      totalBudget: Number(data.totalBudget) || current.totalBudget || 6500,
      alertThreshold: Number(data.alertThreshold) || current.alertThreshold || 80,
    };
    localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(updated));
    return { success: true, data: updated };
  },

  // Analytics
  getAnalytics() {
    initStorage();
    const expenses = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const now = new Date();

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayTotal = expenses
        .filter((e) => e.date && e.date.startsWith(dateStr))
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      last7Days.push({ date: dateStr, day: dayName, amount: dayTotal });
    }

    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const total = expenses
        .filter((e) => {
          const expD = new Date(e.date);
          return expD.getFullYear() === d.getFullYear() && expD.getMonth() === d.getMonth();
        })
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      monthlyTrend.push({ month: monthKey, label: monthLabel, total });
    }

    const catMap = { Food: 0, Travel: 0, Shopping: 0, Education: 0, Entertainment: 0, Others: 0 };
    expenses.forEach((e) => {
      const cat = e.category || 'Others';
      catMap[cat] = (catMap[cat] || 0) + (Number(e.amount) || 0);
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let topCategory = 'Food';
    let topCategoryAmount = 0;
    Object.entries(catMap).forEach(([cat, amt]) => {
      if (amt > topCategoryAmount) {
        topCategoryAmount = amt;
        topCategory = cat;
      }
    });

    return {
      success: true,
      data: {
        weeklyExpenses: last7Days,
        monthlyTrend,
        categoryBreakdown: catMap,
        topCategory,
        topCategoryAmount,
        taskStats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          completionRate,
        },
      },
    };
  },
};
