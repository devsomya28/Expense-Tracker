export const PLANS = {
  FREE: 'FREE',
  PRO: 'PRO'
};

export const SUB_STATUS = {
  ACTIVE: 'ACTIVE',
  TRIALING: 'TRIALING',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED'
};

export const FEATURES = {
  EXPENSE_TRACKING: 'expense_tracking',
  INCOME_TRACKING: 'income_tracking',
  BASIC_ANALYTICS: 'basic_analytics',
  BASIC_BUDGET: 'basic_budget',
  LIMITED_AI: 'limited_ai',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  FINANCIAL_HEALTH: 'financial_health',
  PROACTIVE_INSIGHTS: 'proactive_insights',
  FORECAST: 'forecast',
  SCENARIO_SIMULATOR: 'scenario_simulator',
  MONEY_LEAK_DETECTOR: 'money_leak_detector',
  FINANCIAL_GOALS: 'financial_goals',
  ADVANCED_AI: 'advanced_ai'
};

export const ENTITLEMENTS = {
  [PLANS.FREE]: [
    FEATURES.EXPENSE_TRACKING,
    FEATURES.INCOME_TRACKING,
    FEATURES.BASIC_ANALYTICS,
    FEATURES.BASIC_BUDGET,
    FEATURES.LIMITED_AI
  ],
  [PLANS.PRO]: Object.values(FEATURES) // Pro gets everything
};

export const AI_LIMITS = {
  [PLANS.FREE]: 5,
  [PLANS.PRO]: 100
};