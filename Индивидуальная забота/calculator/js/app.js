/**
 * app.js — единый файл приложения (без ES-модулей)
 * Работает при открытии index.html напрямую через file://
 */

// ═══════════════════════════════════════════════════════
// МОДУЛЬ: ИСТОРИЯ
// ═══════════════════════════════════════════════════════

const STORAGE_KEY = 'calc_history';
const MAX_ENTRIES = 20;

/** @type {Array<{expression: string, result: string}>} */
let historyEntries = [];

/* Загрузка из localStorage */
const historyLoad = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    historyEntries = raw ? JSON.parse(raw) : [];
  } catch {
    historyEntries = [];
  }
};

/* Сохранение в localStorage */
const historySave = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyEntries));
  } catch { /* игнорируем ошибки квоты */ }
};

const historyAdd = (expression, result) => {
  historyEntries.unshift({ expression, result });
  if (historyEntries.length > MAX_ENTRIES) historyEntries.pop();
  historySave();
};

const historyGet = () => [...historyEntries];

const historyClear = () => {
  historyEntries = [];
  historySave();
};

// ═══════════════════════════════════════════════════════
// МОДУЛЬ: ЛОГИКА КАЛЬКУЛЯТОРА
// ═══════════════════════════════════════════════════════

const INITIAL_STATE = {
  operand:     '0',
  operator:    null,
  prevOperand: '',
  result:      '0',
  justEvaled:  false,
};

let state = { ...INITIAL_STATE };

const getState      = () => ({ ...state });
const calcReset     = () => { state = { ...INITIAL_STATE }; };

const inputDigit = (digit) => {
  if (state.justEvaled) {
    state.prevOperand = '';
    state.operator    = null;
    state.justEvaled  = false;
    state.operand     = digit === '0' ? '0' : digit;
  } else if (state.operand === '0') {
    state.operand = digit === '0' ? '0' : digit;
  } else {
    if (state.operand.replace('-', '').length >= 12) return;
    state.operand += digit;
  }
  state.result = state.operand;
};

const inputDot = () => {
  if (state.justEvaled) {
    state.prevOperand = '';
    state.operator    = null;
    state.justEvaled  = false;
    state.operand     = '0.';
  } else if (!state.operand.includes('.')) {
    state.operand += '.';
  }
  state.result = state.operand;
};

const setOperator = (op) => {
  if (state.operator && !state.justEvaled && state.prevOperand !== '') {
    const err = evaluate();
    if (err) return err;
    state.prevOperand = state.result;
  } else {
    state.prevOperand = state.operand;
  }
  state.operator   = op;
  state.operand    = '0';
  state.justEvaled = false;
  return null;
};

const evaluate = () => {
  if (!state.operator || state.prevOperand === '') return null;

  const a = parseFloat(state.prevOperand);
  const b = parseFloat(state.operand);

  if (isNaN(a) || isNaN(b)) return 'Некорректный ввод';

  let res;
  switch (state.operator) {
    case '+': res = a + b; break;
    case '−': res = a - b; break;
    case '×': res = a * b; break;
    case '÷':
      if (b === 0) return 'Деление на ноль';
      res = a / b;
      break;
    default:
      return 'Неизвестный оператор';
  }

  const formatted = parseFloat(res.toPrecision(12)).toString();

  state.result      = formatted;
  state.operand     = formatted;
  state.prevOperand = '';
  state.operator    = null;
  state.justEvaled  = true;

  return null;
};

const backspace = () => {
  if (state.justEvaled) return;
  if (state.operand.length <= 1 || state.operand === '-0') {
    state.operand = '0';
  } else {
    state.operand = state.operand.slice(0, -1);
  }
  state.result = state.operand;
};

const toggleSign = () => {
  if (state.operand === '0') return;
  state.operand = state.operand.startsWith('-')
    ? state.operand.slice(1)
    : '-' + state.operand;
  state.result = state.operand;
};

const percent = () => {
  const n = parseFloat(state.operand);
  if (isNaN(n)) return;
  const prev = parseFloat(state.prevOperand);
  const val  = !isNaN(prev) && state.operator
    ? (prev * n) / 100
    : n / 100;
  state.operand = parseFloat(val.toPrecision(12)).toString();
  state.result  = state.operand;
};

const getExpression = () => {
  if (!state.operator) return '';
  return `${state.prevOperand} ${state.operator}`;
};

// ═══════════════════════════════════════════════════════
// МОДУЛЬ: РЕНДЕРИНГ UI
// ═══════════════════════════════════════════════════════

const elExpression = document.getElementById('expression');
const elResult     = document.getElementById('result');
const elError      = document.getElementById('error-msg');
const elHistory    = document.getElementById('history');

const renderDisplay = ({ expression, result, justEvaled }) => {
  elExpression.textContent = expression;
  elResult.textContent     = result;
  elResult.classList.toggle('has-result', justEvaled);
};

let errorTimer = null;
const showError = (msg) => {
  elError.textContent = msg;
  clearTimeout(errorTimer);
  errorTimer = setTimeout(() => { elError.textContent = ''; }, 2000);
};

const highlightOperator = (op) => {
  document.querySelectorAll('.btn-op').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === op);
  });
};

const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const renderHistory = (entries) => {
  if (entries.length === 0) {
    elHistory.innerHTML = '<span class="history-placeholder">История пуста</span>';
    return;
  }
  elHistory.innerHTML = entries
    .map(e => `
      <div class="history-entry">
        <span class="h-expr">${escapeHTML(e.expression)}</span>
        <span class="h-res">${escapeHTML(e.result)}</span>
      </div>`)
    .join('');
};

let rippleTimer = {};
const ripple = (btn) => {
  btn.classList.remove('ripple');
  void btn.offsetWidth;
  btn.classList.add('ripple');
  const id = btn.dataset.action + (btn.dataset.value || '');
  clearTimeout(rippleTimer[id]);
  rippleTimer[id] = setTimeout(() => btn.classList.remove('ripple'), 300);
};

// ═══════════════════════════════════════════════════════
// ГЛАВНАЯ ЛОГИКА: СОБЫТИЯ
// ═══════════════════════════════════════════════════════

const refresh = () => {
  const s = getState();
  renderDisplay({
    expression: getExpression(),
    result:     s.result,
    justEvaled: s.justEvaled,
  });
  highlightOperator(s.operator);
  renderHistory(historyGet());
};

const handleAction = (action, value = '') => {
  let error = null;

  switch (action) {
    case 'digit':
      inputDigit(value);
      break;
    case 'dot':
      inputDot();
      break;
    case 'operator':
      error = setOperator(value);
      break;
    case 'equals': {
      const s = getState();
      const expr = `${s.prevOperand} ${s.operator} ${s.operand}`;
      error = evaluate();
      if (!error && s.operator) {
        historyAdd(expr, getState().result);
      }
      break;
    }
    case 'toggle-sign':
      toggleSign();
      break;
    case 'percent':
      percent();
      break;
    case 'backspace':
      backspace();
      break;
    case 'clear-history':
      historyClear();
      break;
    default:
      break;
  }

  if (error) showError(error);
  refresh();
};

/* Делегирование событий на панели кнопок */
document.getElementById('buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  ripple(btn);
  handleAction(btn.dataset.action || '', btn.dataset.value || '');
});

/* Кнопка Backspace */
document.getElementById('backspace').addEventListener('click', () => {
  const btn = document.getElementById('backspace');
  ripple(btn);
  handleAction('backspace');
});

/* Клавиатура */
const KEY_MAP = {
  '0':'digit:0','1':'digit:1','2':'digit:2','3':'digit:3','4':'digit:4',
  '5':'digit:5','6':'digit:6','7':'digit:7','8':'digit:8','9':'digit:9',
  '.':'dot', ',':'dot',
  '+':'operator:+', '-':'operator:−', '*':'operator:×', '/':'operator:÷',
  'Enter':'equals', '=':'equals',
  'Backspace':'backspace',
  'Escape':'clear-history',
  '%':'percent',
};

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const mapping = KEY_MAP[e.key];
  if (!mapping) return;
  e.preventDefault();
  const [action, value = ''] = mapping.split(':');
  handleAction(action, value);
  const selector = value
    ? `[data-action="${action}"][data-value="${value}"]`
    : `[data-action="${action}"]`;
  const btn = document.querySelector(selector);
  if (btn) ripple(btn);
});

// ═══════════════════════════════════════════════════════
// СТАРТ
// ═══════════════════════════════════════════════════════
historyLoad();
refresh();
