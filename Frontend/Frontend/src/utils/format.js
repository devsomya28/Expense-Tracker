export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatShortDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

export const isSameMonth = (dateStr, ref = new Date()) => {
  const d = new Date(dateStr);
  return (
    d.getMonth() === ref.getMonth() &&
    d.getFullYear() === ref.getFullYear()
  );
};

export const relativeDueLabel = (dateStr) => {
  const now = new Date();
  const due = new Date(dateStr);
  const diffDays = Math.ceil(
    (due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
};

export const categoryIconMap = {
  Food: "🍔",
  Travel: "🚗",
  Shopping: "🛍️",
  Bills: "⚡",
  Entertainment: "🎬",
  Other: "📦",
};

export const sourceIconMap = {
  Salary: "💼",
  Freelancing: "✏️",
  Other: "📈",
};
