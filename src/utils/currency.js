export const getCurrencyPreference = () => {
  return localStorage.getItem('@app_currency') || 'BRL';
};

export const setCurrencyPreference = (currency) => {
  localStorage.setItem('@app_currency', currency);
};

export const getLanguagePreference = () => {
  return localStorage.getItem('@app_language') || 'pt-BR';
};

export const setLanguagePreference = (lang) => {
  localStorage.setItem('@app_language', lang);
};

/**
 * Formats a number as a currency string based on user preference.
 * @param {number} value 
 * @returns {string} e.g. "R$ 1.500,00" or "$ 1,500.00"
 */
export const formatCurrency = (value) => {
  const currency = getCurrencyPreference();
  let numValue = Number(value) || 0;
  
  // Taxas de conversão fictícias tendo o Real (BRL) como base
  const EXCHANGE_RATES = {
    'BRL': 1,
    'USD': 0.18, // 1 BRL = 0.18 USD
    'EUR': 0.16  // 1 BRL = 0.16 EUR
  };
  
  numValue = numValue * (EXCHANGE_RATES[currency] || 1);
  
  let locale = 'pt-BR';
  if (currency === 'USD') locale = 'en-US';
  if (currency === 'EUR') locale = 'de-DE'; // Use standard Euro formatting (e.g. 1.500,00 €)

  return numValue.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
