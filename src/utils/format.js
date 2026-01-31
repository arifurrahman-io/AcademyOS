import { format } from 'date-fns';

/**
 * Formats dates to match backend style: DD-MM-YYYY
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd-MM-yyyy');
};

/**
 * Formats currency to BDT (Taka)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Capitalizes first letter (e.g., admin -> Admin)
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};