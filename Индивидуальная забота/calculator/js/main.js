/**
 * main.js — точка входа
 *
 * Подключает модули calculator, history, ui.
 * Обрабатывает события кнопок и клавиатуры.
 */

import * as Calc    from './calculator.js';
import * as History from './history.js';
import * as UI      from './ui.js';

// ─── Инициализация ──────────────────────────────────────────────────────────

/** Синхронизирует весь интерфейс с текущим состоянием */
const refresh = () => {
  const s = Calc.getState();
  UI.renderDisplay({
    expression: Calc.getExpression(),
    result:     s.result,
    justEvaled: s.justEvaled,
  });
  UI.highlightOperator(s.operator);
  UI.renderHistory(History.getEntries());
};

// Первый рендер
refresh();

// ─── Обработка кнопок ───────────────────────────────────────────────────────

const buttonsEl = document.getElementById('buttons');
const backspaceEl = document.getElementById('backspace');

/**
 * Центральная функция обработки действий.
 * @param {string} action
 * @param {string} [value]
 */
const handleAction = (action, value = '') => {
  let error = null;

  switch (action) {

    case 'digit':
      Calc.inputDigit(value);
      break;

    case 'dot':
      Calc.inputDot();
      break;

    case 'operator':
      error = Calc.setOperator(value);
      break;

    case 'equals': {
      const s = Calc.getState();
      // Сохраняем в историю до вычисления
      const expr = `${s.prevOperand} ${s.operator} ${s.operand}`;
      error = Calc.evaluate();
      if (!error && s.operator) {
        History.addEntry(expr, Calc.getState().result);
      }
      break;
    }

    case 'toggle-sign':
      Calc.toggleSign();
      break;

    case 'percent':
      Calc.percent();
      break;

    case 'backspace':
      Calc.backspace();
      break;

    case 'clear-history':
      History.clearHistory();
      break;

    default:
      break;
  }

  if (error) UI.showError(error);
  refresh();
};

/* Делегирование событий на панели кнопок */
buttonsEl.addEventListener('click', (e) => {
  const btn = /** @type {HTMLElement} */ (e.target.closest('.btn'));
  if (!btn) return;
  UI.ripple(btn);
  handleAction(btn.dataset.action ?? '', btn.dataset.value ?? '');
});

/* Backspace-кнопка */
backspaceEl.addEventListener('click', () => {
  UI.ripple(backspaceEl);
  handleAction('backspace');
});

// ─── Клавиатура ─────────────────────────────────────────────────────────────

/** Маппинг клавиш к действиям */
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
  // Не перехватываем стандартные браузерные shortcuts
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const mapping = KEY_MAP[e.key];
  if (!mapping) return;

  e.preventDefault();

  const [action, value = ''] = mapping.split(':');
  handleAction(action, value);

  // Подсвечиваем соответствующую кнопку
  const selector = value
    ? `[data-action="${action}"][data-value="${value}"]`
    : `[data-action="${action}"]`;
  const btn = /** @type {HTMLElement|null} */ (document.querySelector(selector));
  if (btn) UI.ripple(btn);
});
