const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, isUsingMongo } = require('../config/db');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Task = require('../models/Task');
const Budget = require('../models/Budget');
const dbStore = require('../config/store');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    console.log('--- Initializing Database for Seeding ---');
    await connectDB();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUserId = '654321098765432109876543'; // Standard 24-char ObjectId format

    const demoUser = {
      _id: demoUserId,
      name: 'Alex Johnson',
      email: 'alex.student@polytechnic.edu',
      password: hashedPassword,
      college: 'Government Polytechnic - Diploma in Computer Science & Engineering',
      currency: '₹',
      monthlyBudget: 6500,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonthKey = `${currentYear}-${currentMonth}`;

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

    const demoExpenses = [
      {
        user: demoUserId,
        title: 'Canteen Lunch & Chai',
        amount: 140,
        category: 'Food',
        paymentMethod: 'UPI',
        date: daysAgo(0),
        notes: 'Lunch with batchmates after Computer Networks lab',
      },
      {
        user: demoUserId,
        title: 'Data Structures Textbook (Narasimha Karumanchi)',
        amount: 520,
        category: 'Education',
        paymentMethod: 'Debit Card',
        date: daysAgo(1),
        notes: 'Semester 4 Reference Book for Algorithms',
      },
      {
        user: demoUserId,
        title: 'Monthly College Bus & Metro Pass',
        amount: 650,
        category: 'Travel',
        paymentMethod: 'UPI',
        date: daysAgo(3),
        notes: 'Student concession monthly travel smart card',
      },
      {
        user: demoUserId,
        title: 'Hostel Mess Food Fee Advance',
        amount: 2200,
        category: 'Food',
        paymentMethod: 'Net Banking',
        date: daysAgo(5),
        notes: 'Monthly mess dues payment',
      },
      {
        user: demoUserId,
        title: 'Web Dev Project Color Prints & Spiral Binding',
        amount: 180,
        category: 'Education',
        paymentMethod: 'Cash',
        date: daysAgo(6),
        notes: 'Project documentation submission to HOD',
      },
      {
        user: demoUserId,
        title: 'Weekend Movie & Popcorn with CSE Friends',
        amount: 320,
        category: 'Entertainment',
        paymentMethod: 'UPI',
        date: daysAgo(8),
        notes: 'Relaxation after mid-term examinations',
      },
      {
        user: demoUserId,
        title: 'College Fest T-Shirt & Badge',
        amount: 380,
        category: 'Shopping',
        paymentMethod: 'UPI',
        date: daysAgo(11),
        notes: 'Annual Tech Fest merchandise',
      },
      {
        user: demoUserId,
        title: '5G Student Data Recharge (30 Days)',
        amount: 299,
        category: 'Others',
        paymentMethod: 'UPI',
        date: daysAgo(14),
        notes: 'Online lectures and GitHub project pushes',
      },
      {
        user: demoUserId,
        title: 'Lab Record Sheets & Engineering Drawing Pens',
        amount: 190,
        category: 'Education',
        paymentMethod: 'Cash',
        date: daysAgo(16),
        notes: 'Microprocessor lab record documentation',
      },
      {
        user: demoUserId,
        title: 'Evening Coffee & Samosas during Group Study',
        amount: 95,
        category: 'Food',
        paymentMethod: 'UPI',
        date: daysAgo(18),
        notes: 'Study session before OS unit test',
      },
    ];

    const demoTasks = [
      {
        user: demoUserId,
        title: 'Computer Networks - Socket Programming Lab Record',
        description: 'Complete TCP/UDP client-server socket code and output screenshots in the lab manual.',
        type: 'Assignment',
        subject: 'Computer Networks',
        priority: 'High',
        dueDate: daysAhead(1),
        completed: false,
      },
      {
        user: demoUserId,
        title: 'DBMS - SQL Mini Project with Normalization',
        description: 'Design ER Diagram, 3NF schema, and sample SQL queries for Hospital Management System.',
        type: 'Project',
        subject: 'Database Systems',
        priority: 'Urgent',
        dueDate: daysAhead(3),
        completed: false,
      },
      {
        user: demoUserId,
        title: 'Operating Systems - Semaphore & Deadlock Seminar Prep',
        description: 'Prepare 10-slide PowerPoint presentation on Banker\'s Algorithm for Deadlock Avoidance.',
        type: 'Exam Prep',
        subject: 'Operating Systems',
        priority: 'Medium',
        dueDate: daysAhead(5),
        completed: false,
      },
      {
        user: demoUserId,
        title: 'Data Structures - Implement AVL Tree in C++',
        description: 'Write functions for Left-Rotate, Right-Rotate, Insertion, and Inorder Traversal.',
        type: 'Assignment',
        subject: 'Data Structures',
        priority: 'High',
        dueDate: daysAhead(7),
        completed: false,
      },
      {
        user: demoUserId,
        title: 'Renew Semester Library Books (Operating System Concepts)',
        description: 'Visit Central Library to renew Galvin textbook before penalty date.',
        type: 'Personal Task',
        subject: 'General',
        priority: 'Low',
        dueDate: daysAhead(2),
        completed: false,
      },
      {
        user: demoUserId,
        title: 'Web Technology - Build Responsive Portfolio Site',
        description: 'Created dynamic HTML5, Tailwind CSS, and JavaScript portfolio with GitHub deployment.',
        type: 'Project',
        subject: 'Web Technologies',
        priority: 'Medium',
        dueDate: daysAgo(2),
        completed: true,
        completedAt: daysAgo(2),
      },
      {
        user: demoUserId,
        title: 'Python Lab - Implement Recursive Fibonacci & Factorial',
        description: 'Verified test cases and submitted to professor via Google Classroom.',
        type: 'Assignment',
        subject: 'Python Programming',
        priority: 'Low',
        dueDate: daysAgo(4),
        completed: true,
        completedAt: daysAgo(4),
      },
    ];

    const demoBudget = {
      user: demoUserId,
      month: currentMonthKey,
      totalBudget: 6500,
      categoryBudgets: {
        Food: 2500,
        Travel: 1000,
        Shopping: 800,
        Education: 1200,
        Entertainment: 500,
        Others: 500,
      },
      alertThreshold: 80,
    };

    if (isUsingMongo()) {
      console.log('Seeding directly into MongoDB database...');
      await User.deleteMany({ email: demoUser.email });
      await Expense.deleteMany({ user: demoUserId });
      await Task.deleteMany({ user: demoUserId });
      await Budget.deleteMany({ user: demoUserId, month: currentMonthKey });

      await User.create(demoUser);
      await Expense.insertMany(demoExpenses);
      await Task.insertMany(demoTasks);
      await Budget.create(demoBudget);
    } else {
      console.log('Seeding into local persistent JSON storage...');
      const localData = dbStore.getLocalData();

      // Remove existing demo user data
      localData.users = localData.users.filter((u) => u.email !== demoUser.email);
      localData.expenses = localData.expenses.filter((e) => String(e.user) !== String(demoUserId));
      localData.tasks = localData.tasks.filter((t) => String(t.user) !== String(demoUserId));
      localData.budgets = localData.budgets.filter((b) => !(String(b.user) === String(demoUserId) && b.month === currentMonthKey));

      // Push demo records
      localData.users.push(demoUser);
      demoExpenses.forEach((exp, idx) => {
        localData.expenses.push({
          _id: `exp_${idx}_${Date.now()}`,
          ...exp,
          createdAt: exp.date,
          updatedAt: exp.date,
        });
      });
      demoTasks.forEach((tsk, idx) => {
        localData.tasks.push({
          _id: `task_${idx}_${Date.now()}`,
          ...tsk,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      localData.budgets.push({
        _id: `budget_${Date.now()}`,
        ...demoBudget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      dbStore.resetData(localData);
    }

    console.log('\n=============================================');
    console.log(' Demo Data Seeded Successfully!');
    console.log(` Student Email: ${demoUser.email}`);
    console.log(` Password:      password123`);
    console.log(` Expenses:      ${demoExpenses.length} items seeded`);
    console.log(` Tasks:         ${demoTasks.length} items seeded`);
    console.log(` Monthly Budget: ₹${demoBudget.totalBudget} for ${demoBudget.month}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error during data seeding:', err);
    process.exit(1);
  }
};

seedData();
