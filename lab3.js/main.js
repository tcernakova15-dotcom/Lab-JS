const transactions = [
  {
    transaction_id: "1",
    transaction_date: "2025-05-08",
    transaction_amount: 1000.0,
    transaction_type: "debit",
    transaction_description: "Оплата абонемента Orange",
    merchant_name: "Orange",
    card_type: "debit",
  },
  {
    transaction_id: "2",
    transaction_date: "2025-06-09",
    transaction_amount: 2000.0,
    transaction_type: "credit",
    transaction_description: "Стипендия от университета",
    merchant_name: "USM",
    card_type: "debit",
  },
  {
    transaction_id: "3",
    transaction_date: "2025-07-10",
    transaction_amount: 1500.0,
    transaction_type: "debit",
    transaction_description: "Покупка в магазине электроники",
    merchant_name: "TechStore",
    card_type: "debit",
  },
  {
    transaction_id: "4",
    transaction_date: "2026-08-11",
    transaction_amount: 500.0,
    transaction_type: "debit",
    transaction_description: "Оплата коммунальных услуг",
    merchant_name: "Prmier Energy",
    card_type: "debit",
  },
  {
    transaction_id: "5",
    transaction_date: "2026-09-12",
    transaction_amount: 3000.0,
    transaction_type: "credit",
    transaction_description: "Премия за отличную учебу",
    merchant_name: "USM",
    card_type: "debit",
  },
  {
    transaction_id: "6",
    transaction_date: "2026-10-13",
    transaction_amount: 800.0,
    transaction_type: "debit",
    transaction_description: "Покупка одежды",
    merchant_name: "FashionStore",
    card_type: "debit",
  },
  {
    transaction_id: "7",
    transaction_date: "2026-11-14",
    transaction_amount: 1200.0,
    transaction_type: "debit",
    transaction_description: "Оплата мобильной связи",
    merchant_name: "MobileProvider",
    card_type: "debit",
  },
  {
    transaction_id: "8",
    transaction_date: "2026-12-15",
    transaction_amount: 2500.0,
    transaction_type: "credit",
    transaction_description: "Подарок от родителей",
    merchant_name: "Parents",
    card_type: "debit",
  },
  {
    transaction_id: "9",
    transaction_date: "2027-01-16",
    transaction_amount: 600.0,
    transaction_type: "debit",
    transaction_description: "Покупка книг",
    merchant_name: "Bookstore",
    card_type: "debit",
  },
  {
    transaction_id: "10",
    transaction_date: "2027-02-17",
    transaction_amount: 400.0,
    transaction_type: "debit",
    transaction_description: "Оплата подписки",
    merchant_name: "StreamService",
    card_type: "debit",
  }
];

// 1. Уникальные типы
function getUniqueTransactionTypes(transactions) {
  return [...new Set(transactions.map(t => t.transaction_type))];
}

// 2. Сумма всех транзакций
function calculateTotalAmount(transactions) {
  return transactions.reduce((total, t) => total + t.transaction_amount, 0);
}

// 3. Сумма по дате (исправлено: добавлены параметры в функцию)
function calculateAmountByDate(transactions, year, month, day) {
  return transactions
    .filter(t => {
      const date = new Date(t.transaction_date);
      return (!year || date.getFullYear() === year) &&
             (!month || date.getMonth() + 1 === month) &&
             (!day || date.getDate() === day);
    })
    .reduce((sum, t) => sum + t.transaction_amount, 0);
}

// 4. По типу
function getTransactionsByType(transactions, type) {
  return transactions.filter(t => t.transaction_type === type);
}

// 5. Диапазон дат
function getTransactionsByDateRange(transactions, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return transactions.filter(t => {
    const date = new Date(t.transaction_date);
    return date >= start && date <= end;
  });
}

// 6. По мерчанту
function getTransactionsByMerchant(transactions, merchantName) {
  return transactions.filter(t => t.merchant_name === merchantName);
}

// 7. Среднее значение
function calculateAverageAmount(transactions) {
  if (transactions.length === 0) return 0;
  return calculateTotalAmount(transactions) / transactions.length;
}

// 8. По диапазону суммы
function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
  return transactions.filter(t => t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount);
}

// 9. Сумма дебетовых
function calculateTotalDebitAmount(transactions) {
  return transactions
    .filter(t => t.transaction_type === "debit")
    .reduce((total, t) => total + t.transaction_amount, 0);
}

// 10. Месяц с макс кол-вом транзакций
function getMonthWithMostTransactions(transactions) {
  const monthCounts = {};
  transactions.forEach(t => {
    const month = new Date(t.transaction_date).getMonth() + 1;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  const maxVal = Math.max(...Object.values(monthCounts));
  return Object.keys(monthCounts).find(key => monthCounts[key] === maxVal);
}

// 11. Месяц с макс дебетом
function getMonthWithMostDebitTransactions(transactions) {
  const monthCounts = {};
  transactions.filter(t => t.transaction_type === "debit").forEach(t => {
    const month = new Date(t.transaction_date).getMonth() + 1;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  if (Object.keys(monthCounts).length === 0) return null;
  const maxVal = Math.max(...Object.values(monthCounts));
  return Object.keys(monthCounts).find(key => monthCounts[key] === maxVal);
}

// 12. Каких транзакций больше
function getMostFrequentTransactionType(transactions) {
  const counts = transactions.reduce((acc, t) => {
    acc[t.transaction_type] = (acc[t.transaction_type] || 0) + 1;
    return acc;
  }, {});
  if (counts.debit > (counts.credit || 0)) return "debit";
  if (counts.credit > (counts.debit || 0)) return "credit";
  return "equal";
}

// 13. До указанной даты
function getTransactionsBeforeDate(transactions, date) {
  const targetDate = new Date(date);
  return transactions.filter(t => new Date(t.transaction_date) < targetDate);
}

// 14. По ID
function getTransactionById(transactions, id) {
  return transactions.find(t => t.transaction_id === id);
}

// 15. Только описания
function getTransactionDescriptions(transactions) {
  return transactions.map(t => t.transaction_description);
}

// --- ТЕСТЫ ---
console.log("1. Уникальные типы:", getUniqueTransactionTypes(transactions));
console.log("2. Общая сумма:", calculateTotalAmount(transactions));
console.log("7. Средний чек:", calculateAverageAmount(transactions));
console.log("12. Частый тип:", getMostFrequentTransactionType(transactions));
console.log("15. Описания:", getTransactionDescriptions(transactions));