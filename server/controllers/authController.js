const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbStore = require('../config/store');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_student_jwt_key_2026_cse_portfolio', {
    expiresIn: '30d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, currency, monthlyBudget } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user exists
    const userExists = await dbStore.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Create user
    const user = await dbStore.createUser({
      name,
      email,
      password,
      college: college || 'Diploma in Computer Science & Engineering',
      currency: currency || '₹',
      monthlyBudget: monthlyBudget ? Number(monthlyBudget) : 6000,
    });

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const user = await dbStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, college, currency, monthlyBudget, password } = req.body;
    const userId = req.user._id || req.user.id;

    const updates = {};
    if (name) updates.name = name;
    if (college) updates.college = college;
    if (currency) updates.currency = currency;
    if (monthlyBudget !== undefined) updates.monthlyBudget = Number(monthlyBudget);
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }
      updates.password = password;
    }

    const updatedUser = await dbStore.updateUser(userId, updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick Demo Login for Evaluation/Interviews
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'alex.student@polytechnic.edu';
    let user = await dbStore.findUserByEmail(demoEmail);

    if (!user) {
      user = await dbStore.createUser({
        name: 'Alex Johnson',
        email: demoEmail,
        password: 'password123',
        college: 'Government Polytechnic - Diploma in Computer Science & Engineering',
        currency: '₹',
        monthlyBudget: 6500,
      });

      const userId = user._id || user.id;
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Create starter expenses so demo dashboard is immediately vibrant
      await dbStore.createExpense({
        user: userId,
        title: 'Canteen Lunch & Chai',
        amount: 140,
        category: 'Food',
        paymentMethod: 'UPI',
        date: new Date().toISOString(),
        notes: 'Lunch after Computer Networks lab',
      });
      await dbStore.createExpense({
        user: userId,
        title: 'Data Structures Reference Textbook',
        amount: 520,
        category: 'Education',
        paymentMethod: 'Debit Card',
        date: new Date(Date.now() - 86400000).toISOString(),
        notes: 'Semester 4 Algorithms guide',
      });
      await dbStore.createExpense({
        user: userId,
        title: 'Monthly College Bus & Metro Pass',
        amount: 650,
        category: 'Travel',
        paymentMethod: 'UPI',
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        notes: 'Student concession monthly travel pass',
      });
      await dbStore.createExpense({
        user: userId,
        title: 'Web Dev Project Printing & Binding',
        amount: 180,
        category: 'Education',
        paymentMethod: 'Cash',
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
        notes: 'Mini project documentation submission',
      });
      await dbStore.createExpense({
        user: userId,
        title: 'Hostel Mess Food Fee Advance',
        amount: 2200,
        category: 'Food',
        paymentMethod: 'Net Banking',
        date: new Date(Date.now() - 6 * 86400000).toISOString(),
        notes: 'Monthly mess charges',
      });

      // Create starter tasks
      await dbStore.createTask({
        user: userId,
        title: 'Computer Networks - Socket Programming Lab Record',
        description: 'Complete TCP/UDP client-server socket code and output screenshots in the manual.',
        type: 'Assignment',
        subject: 'Computer Networks',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        completed: false,
      });
      await dbStore.createTask({
        user: userId,
        title: 'DBMS - SQL Mini Project with Normalization',
        description: 'Design ER Diagram, 3NF schema, and sample SQL queries for Hospital System.',
        type: 'Project',
        subject: 'Database Systems',
        priority: 'Urgent',
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        completed: false,
      });
      await dbStore.createTask({
        user: userId,
        title: 'Web Technology - Build Responsive Portfolio Site',
        description: 'Created dynamic HTML5, Tailwind CSS, and JavaScript portfolio.',
        type: 'Project',
        subject: 'Web Technologies',
        priority: 'Medium',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        completed: true,
      });

      // Create budget
      await dbStore.setBudget(userId, {
        month: currentMonthKey,
        totalBudget: 6500,
        alertThreshold: 80,
      });
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      message: 'Demo login successful',
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  demoLogin,
};
