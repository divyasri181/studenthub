# Smart Student Expense & Task Manager 🎓💸📋

> A modern, responsive Full-Stack MERN web application built specifically for college and diploma students to manage their daily campus expenses, track budgets, organize coursework assignments, and analyze spending patterns.

![Project Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN%20(React%20%2B%20Node%20%2B%20Express%20%2B%20MongoDB)-purple?style=for-the-badge)
![UI Design](https://img.shields.io/badge/Theme-Purple%20%26%20White%20SaaS-7c3aed?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Key Highlights for Diploma CSE Portfolio & Interviews

- **Full MERN Stack Architecture**: React 18 + Vite frontend, Node.js + Express REST API, MongoDB with Mongoose ODM.
- **Dual-Mode Resilient Database Layer**: Natively connects to MongoDB Atlas / Local MongoDB. If MongoDB is not running, it automatically activates a persistent local JSON store so the application runs 100% out of the box with zero setup friction!
- **1-Click Demo Student Access**: Evaluators and interviewers can instantly explore pre-seeded student expenses and assignments with a single click.
- **Interactive Data Visualizations**: Built with **Chart.js** & **react-chartjs-2** (Weekly daily spending bar chart, 6-month spending line trend, category distribution doughnut, task completion doughnut).
- **Dark Mode & Light Mode**: Seamless theme switching with persistent user preference in `localStorage`.
- **Export & Print**: One-click **CSV Spreadsheet Export** for expense history and printable analytical reports.

---

## 🚀 Main Features Breakdown

### 1. User Authentication & Profile
- Student Registration with Name, Email, Password, College/Branch, and Target Monthly Budget.
- Secure password hashing using **bcryptjs (10 salt rounds)**.
- Stateless authentication using **JSON Web Tokens (JWT)** with 30-day expiration.
- Instant **1-Click Demo Login** pre-loaded with realistic Diploma CSE coursework and expenses.
- Profile management: Update student name, college/branch, currency symbol, target budget, and password.

### 2. Executive Student Dashboard
- **Metric Cards**:
  - **Monthly Spent**: Current month expense total with percentage of budget used.
  - **Monthly Budget**: Current month limit with dynamic progress bar.
  - **Remaining Balance**: Live balance with recommended daily spending allowance.
  - **Active Tasks**: Pending and completed tasks count with overdue indicators.
- **Interactive Visualizations**:
  - Live Doughnut chart for category distribution.
  - Mini-badges showing percentage share per category.
- **Upcoming Assignments & Deadlines**:
  - Instant checkbox toggle to complete assignments directly from the dashboard.
  - Color-coded deadline pills (`Due Today`, `Due Tomorrow`, `Due in 2d`, `Overdue`).
- **Quick Action Menu**: Fast access to log an expense or create an assignment.
- **Budget Alert Banner**: Automatically fires warnings at 80% usage and danger alerts when exceeded.

### 3. Expense Tracker
- **CRUD Operations**: Add, view, edit, and delete expenses with confirmation modals.
- **Categories**: `Food`, `Travel`, `Shopping`, `Education`, `Entertainment`, and `Others`.
- **Payment Methods**: `UPI`, `Cash`, `Debit Card`, `Credit Card`, `Net Banking`.
- **Filters & Search**:
  - Live search by title or remarks.
  - Filter by category pills.
  - Date range filtering (`startDate` to `endDate`).
- **Metrics Summary**: Filtered total, average spend per expense, highest single expense.
- **CSV Data Export**: Download transaction history as `.csv` for Excel or Google Sheets.

### 4. Coursework & Task Manager
- **Assignment & Personal Tasks**:
  - Types: `Assignment`, `Project`, `Exam Prep`, `Personal Task`, `Study Session`.
  - Subject/Course tags (e.g. *Computer Networks*, *DBMS*, *Data Structures*).
  - Priority levels: `Low`, `Medium`, `High`, `Urgent` with color-coded badges.
  - Due date with relative deadline countdown calculations.
- **Status Tabs**: Easily switch between `All Tasks`, `Pending`, and `Completed`.
- **Dual View Modes**:
  - **List View**: Detailed rows with quick status toggle, notes, and actions.
  - **Grid View**: Modern card layout perfect for visual task inspection.

### 5. Budget Management & Velocity Planning
- Set custom monthly budget target for any month (`YYYY-MM`).
- Dynamic progress bar with automatic status badges:
  - 🟢 **Normal**: Under budget threshold.
  - 🟡 **Warning**: Approaching alert threshold (default 80%).
  - 🔴 **Exceeded**: Spending exceeds budget ceiling.
- **Recommended Daily Spending Allowance**: Automatically calculated as `Remaining Balance / Days Left in Month`.
- Adjustable warning alert threshold slider (50% to 95%).

### 6. Reports & Analytics
- **Weekly Daily Spending Bar Chart**: Visualizes cash outflows across the last 7 days.
- **6-Month Expense History Trend Line Chart**: Tracks spending velocity across academic semesters.
- **Category Doughnut Chart**: Shows percentage split between food, books, travel, and campus life.
- **Task Completion Doughnut**: Visualizes productivity and submission rates.
- **Printable Report**: Formatted for browser print / PDF export.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React Icons |
| **Data Visualization** | Chart.js, React-Chartjs-2 |
| **Backend** | Node.js, Express.js, RESTful API |
| **Database** | MongoDB, Mongoose ODM (with automatic resilient local JSON fallback) |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, CORS |
| **Tooling** | Concurrently, PostCSS, Autoprefixer, Morgan |

---

## 📂 Project Structure

```text
smart-student-manager/
├── package.json                 # Monorepo scripts (dev, start, seed, build)
├── README.md                    # Complete documentation
│
├── server/                      # Node.js + Express Backend
│   ├── .env                     # Server environment configuration
│   ├── .env.example             # Example environment template
│   ├── package.json             # Server dependencies & scripts
│   ├── server.js                # Express app entry point
│   ├── config/
│   │   ├── db.js                # MongoDB Mongoose connection handler
│   │   └── store.js             # Dual-mode database layer (Mongo + JSON fallback)
│   ├── models/
│   │   ├── User.js              # User schema & bcrypt hooks
│   │   ├── Expense.js           # Expense schema with user indexing
│   │   ├── Task.js              # Task schema with priority & due dates
│   │   └── Budget.js            # Monthly budget schema with thresholds
│   ├── controllers/
│   │   ├── authController.js    # Register, login, demoLogin, profile
│   │   ├── expenseController.js # CRUD, filtering, date range, stats
│   │   ├── taskController.js    # CRUD, toggle complete, stats
│   │   ├── budgetController.js  # Budget status, daily velocity
│   │   └── reportController.js  # 7-day, 6-month analytics & CSV export
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   ├── expenseRoutes.js     # /api/expenses endpoints
│   │   ├── taskRoutes.js        # /api/tasks endpoints
│   │   ├── budgetRoutes.js      # /api/budget endpoints
│   │   └── reportRoutes.js      # /api/reports endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT bearer verification
│   │   └── errorMiddleware.js   # Central error & 404 handlers
│   ├── scripts/
│   │   └── seed.js              # Realistic Diploma CSE demo data seeder
│   └── data/
│       └── student_db.json      # Persistent local database store
│
└── client/                      # React 18 + Vite Frontend
    ├── package.json             # Frontend dependencies & scripts
    ├── vite.config.js           # Vite dev server & API proxy
    ├── tailwind.config.js       # Purple SaaS design theme & dark mode
    ├── postcss.config.js        # PostCSS Tailwind plugins
    ├── index.html               # HTML5 entry with Inter font
    └── src/
        ├── main.jsx             # React DOM root with providers
        ├── App.jsx              # Routes & authenticated layout
        ├── index.css            # Tailwind directives & custom CSS
        ├── components/
        │   ├── Navbar.jsx       # Top navigation, dark mode, quick add
        │   ├── Sidebar.jsx      # Purple SaaS sidebar with active links
        │   ├── StatCard.jsx     # Reusable metric card with progress
        │   ├── Modal.jsx        # Reusable animated dialog
        │   ├── ExpenseModal.jsx # Add/Edit expense form modal
        │   ├── TaskModal.jsx    # Add/Edit task & assignment modal
        │   ├── BudgetModal.jsx  # Budget setter dialog
        │   ├── ConfirmModal.jsx # Delete confirmation dialog
        │   └── BudgetAlert.jsx  # Smart budget threshold warning banner
        ├── pages/
        │   ├── Dashboard.jsx    # Executive overview & mini-charts
        │   ├── Expenses.jsx     # Expense history table, search & export
        │   ├── Tasks.jsx        # Task manager (List & Grid views)
        │   ├── Budget.jsx       # Budget planner & daily velocity
        │   ├── Reports.jsx      # Analytics charts & print view
        │   ├── Profile.jsx      # Student settings & password update
        │   ├── Login.jsx        # Sign-in & 1-Click Demo Login
        │   └── Register.jsx     # New student sign-up
        ├── context/
        │   ├── AuthContext.jsx         # User & JWT session state
        │   ├── ThemeContext.jsx        # Dark/Light mode state
        │   └── NotificationContext.jsx # Toast alert system
        ├── services/
        │   ├── api.js           # Axios instance with JWT interceptor
        │   ├── authService.js   # Auth API calls
        │   ├── expenseService.js# Expense API calls
        │   ├── taskService.js   # Task API calls
        │   ├── budgetService.js # Budget API calls
        │   └── reportService.js # Analytics & CSV export API calls
        └── utils/
            ├── chartConfig.js   # Chart.js element registrations
            └── formatters.js    # Currency, dates, priority badges
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org))
- **npm**: v8.0.0 or higher
- **MongoDB** *(Optional)*: Local MongoDB server or MongoDB Atlas connection string. If MongoDB is not present, the app will automatically use its internal persistent JSON storage without failing!

### Step 1: Install Dependencies
Open your terminal in the root `smart-student-manager` directory:

```bash
# Install root, backend, and frontend dependencies in one command
npm run install-all
```

*(Alternatively, run `npm install` inside the root, `server/`, and `client/` directories).*

### Step 2: Configure Environment Variables (Optional)
The server comes pre-configured with default settings in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_student_manager
JWT_SECRET=supersecret_student_jwt_key_2026_cse_portfolio
NODE_ENV=development
```
> *To connect to MongoDB Atlas, simply replace `MONGO_URI` with your Atlas connection string.*

### Step 3: Populate Sample Student Data
Populate realistic Diploma in CSE expenses, course assignments, and budget metrics:

```bash
npm run seed
```

### Step 4: Run the Application
Start both the Backend API server and Frontend Vite client concurrently:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Account Credentials

You can use the **"1-Click Demo Student Login"** button on the Login page, or enter these credentials manually:

- **Email**: `alex.student@polytechnic.edu`
- **Password**: `password123`
- **Role**: Diploma CSE Final Year Student
- **College**: Government Polytechnic - Diploma in Computer Science & Engineering

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new student account | No |
| `POST` | `/api/auth/login` | Sign in with email and password | No |
| `POST` | `/api/auth/demo` | Instant 1-click demo login | No |
| `GET` | `/api/auth/me` | Fetch logged-in student profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile details / password | Yes |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/expenses` | Get all expenses (supports category, search, dates) | Yes |
| `GET` | `/api/expenses/:id` | Get single expense by ID | Yes |
| `POST` | `/api/expenses` | Create new expense | Yes |
| `PUT` | `/api/expenses/:id` | Update expense details | Yes |
| `DELETE` | `/api/expenses/:id` | Delete expense | Yes |
| `GET` | `/api/expenses/stats/summary` | Get monthly & all-time totals and category spend | Yes |

### Tasks & Assignments (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Get tasks (supports status, priority, type, search) | Yes |
| `GET` | `/api/tasks/:id` | Get single task by ID | Yes |
| `POST` | `/api/tasks` | Create new assignment / task | Yes |
| `PUT` | `/api/tasks/:id` | Update task details | Yes |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task completion status | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |
| `GET` | `/api/tasks/stats/summary` | Get task counts, completion rate & upcoming deadlines | Yes |

### Budget & Analytics (`/api/budget` & `/api/reports`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/budget` | Get budget status, remaining balance & daily velocity | Yes |
| `POST` | `/api/budget` | Set or update monthly budget & threshold | Yes |
| `GET` | `/api/reports/analytics`| Comprehensive 7-day, 6-month & category data | Yes |
| `GET` | `/api/reports/export/expenses`| Export expenses as `.csv` file download | Yes |

---

## 💡 Software Engineering Concepts Showcased

1. **Separation of Concerns**: Strict boundary between presentation components, state contexts, API service abstractions, and backend controller/routing layers.
2. **Defensive Database Fallback**: Rather than crashing when external database daemons are missing, the server handles connection timeouts gracefully and runs seamlessly via a dual-mode repository adapter.
3. **Data Integrity & Validation**: Strict input validation on both client forms and backend endpoints prevents invalid amounts, malformed dates, and empty strings.
4. **Optimistic & Synchronized UI**: Global state and refresh triggers immediately reflect created/updated expenses and task completion without requiring full-page reloads.
5. **Modern Responsive Design**: Implemented with mobile-first CSS media queries, responsive grids, collapsible drawers, and accessibility considerations.

---

## 👨‍💻 Developer & Portfolio Info

- **Project**: Smart Student Expense & Task Manager
- **Domain**: Web Application Development / CSE Portfolio
- **Target Audience**: Diploma / Undergraduate Engineering Students
- **License**: [MIT](LICENSE)
