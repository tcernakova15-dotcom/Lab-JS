/**
 * history.js — модуль истории вычислений
 *
 * Хранит список последних операций и управляет их отображением.
 * Использует localStorage для сохранения между сессиями.
 */

const STORAGE_KEY = 'calc_history';
const MAX_ENTRIES = 20;

/** @type {Array<{expression: string, result: string}>} */
let entries = [];

/* Загрузка из localStorage */
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    entries = raw ? JSON.parse(raw) : [];
  } catch {
    entries = [];
  }
};

/* Сохранение в localStorage */
const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch { /* игнорируем ошибки квоты */ }
};

/**
 * Добавляет запись в историю.
 * @param {string} expression — строка выражения, например «12 + 8»
 * @param {string} result     — результат, например «20»
 */
export const addEntry = (expression, result) => {
  entries.unshift({ expression, result });
  if (entries.length > MAX_ENTRIES) entries.pop();
  save();
};

/** Возвращает копию массива записей */
export const getEntries = () => [...entries];

/** Очищает историю */
export const clearHistory = () => {
  entries = [];
  save();
};

// Инициализируем при загрузке модуля
load();
