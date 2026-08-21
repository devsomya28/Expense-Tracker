import cron from "node-cron";

import RecurringModel from "../models/recurring.model.js";
import ExpenseModel from "../models/expense.model.js";

const addFrequency = (date, frequency) => {
  const nextDate = new Date(date);

  switch (frequency) {
    case "Daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case "Weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case "Monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case "Yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
};

const processRecurringExpenses = async () => {
  try {
    const now = new Date();

    const recurringExpenses = await RecurringModel.find({
      isActive: true,
      nextDueDate: {
        $lte: now,
      },
    });

    for (const recurring of recurringExpenses) {
      await ExpenseModel.create({
        user: recurring.user,
        amount: recurring.amount,
        title: recurring.title,
        category: recurring.category,
        date: recurring.nextDueDate,
        paymentMethod: recurring.paymentMethod,
      });

      recurring.nextDueDate = addFrequency(
        recurring.nextDueDate,
        recurring.frequency
      );

      await recurring.save();

      console.log(
        `Recurring expense generated: ${recurring.title}`
      );
    }
  } catch (error) {
    console.error(
      "Recurring Expense Job Error:",
      error
    );
  }
};

// Run every day at midnight
cron.schedule("0 0 * * *", processRecurringExpenses);

export default processRecurringExpenses;