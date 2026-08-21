export const SCORING_WEIGHTS = {
  BUDGET_DISCIPLINE: 0.25,
  SAVINGS_RATE: 0.20,
  SPENDING_STABILITY: 0.20,
  RECURRING_BURDEN: 0.15,
  CASHFLOW: 0.20
};

export const HEALTH_STATUS = [
  { max: 39, label: "CRITICAL" },
  { max: 59, label: "AT_RISK" },
  { max: 74, label: "FAIR" },
  { max: 89, label: "HEALTHY" },
  { max: 100, label: "EXCELLENT" }
];

export const getStatusLabel = (score) => {
  const status = HEALTH_STATUS.find(s => score <= s.max);
  return status ? status.label : "EXCELLENT";
};