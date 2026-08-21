import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import Income from '../models/income.model.js';
import Expense from '../models/expense.model.js';
import Budget from '../models/budget.model.js';
import Goal from '../models/goal.model.js';
import Subscription from '../models/subscription.model.js';
import { PLANS, SUB_STATUS } from '../config/subscription.constants.js';

dotenv.config();

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected. Wiping existing demo user data...');

    // 1. Setup Demo User
    const email = 'demo@finora.ai';
    await User.deleteOne({ email });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('DemoPassword123!', salt);
    
    const user = await User.create({
      username: 'Alex Demo',
      email,
      password: hashedPassword
    });
    const userId = user._id;

    // Clear old data for safety if email matched
    await Promise.all([
      Account.deleteMany({ user: userId }),
      Income.deleteMany({ user: userId }),
      Expense.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Subscription.deleteMany({ user: userId })
    ]);

    // 2. Grant PRO Subscription
    await Subscription.create({
      user: userId,
      plan: PLANS.PRO,
      status: SUB_STATUS.ACTIVE,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });

    // 3. Accounts
    await Account.create({ user: userId, name: 'Main Checking', balance: 4250.00, type: 'Bank Account' });

    // 4. Time Setup
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 5. Income (Last Month & This Month)
    await Income.insertMany([
      { user: userId, title: 'Monthly Salary', source: 'Salary', amount: 5000, date: new Date(prevMonthStart).setDate(1) },
      { user: userId, title: 'Monthly Salary', source: 'Salary', amount: 5000, date: new Date(currentMonthStart).setDate(1) }
    ]);

    // 6. Budget
    // Budget schema only supports a single overall monthly budget per user
    // (no per-category budgets), so combine the intended category amounts.
    await Budget.create({ user: userId, monthlyBudget: 800 });

    // 7. Expenses (Create a Spike in Food for Insight Detection)
    const expenses = [];
    
    // Last month expenses (Stable)
    for(let i=1; i<=10; i++) {
      expenses.push({ user: userId, title: 'Groceries', amount: 45, category: 'Food', paymentMethod: 'Debit Card', date: new Date(prevMonthStart).setDate(i * 2) });
    }
    expenses.push({ user: userId, title: 'Gas', amount: 50, category: 'Travel', paymentMethod: 'Debit Card', date: new Date(prevMonthStart).setDate(15) });

    // This month expenses (Spike & High Run Rate)
    for(let i=1; i<=Math.min(now.getDate(), 15); i++) {
      expenses.push({ user: userId, title: 'Dining Out', amount: 65, category: 'Food', paymentMethod: 'Credit Card', date: new Date(currentMonthStart).setDate(i) });
    }
    expenses.push({ user: userId, title: 'Car Repair', amount: 450, category: 'Travel', paymentMethod: 'Credit Card', date: new Date(currentMonthStart).setDate(2) });

    await Expense.insertMany(expenses);

    // 8. Goals
    await Goal.create({
      user: userId,
      name: 'MacBook Pro',
      targetAmount: 2000,
      currentAmount: 800,
      targetDate: new Date(now.getFullYear(), now.getMonth() + 4, 1),
      monthlyContribution: 200,
      status: 'ACTIVE'
    });

    console.log('Demo data seeded successfully!');
    console.log('Login: demo@finora.ai | Password: DemoPassword123!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDemoData();