const ROLE_PREFIXES: Record<string, string> = {
  OWNER: 'OWN',
  DEPUTY_MANAGER: 'DPM',
  HR_MANAGER: 'HRM',
  FINANCE_MANAGER: 'FIN',
  KITCHEN_MANAGER: 'KOM',
  CHEF: 'CHF',
  WAITER: 'WTR',
};

export const generateStaffId = (role: string): string => {
  const prefix = ROLE_PREFIXES[role] || 'ENG';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${id}`;
};
