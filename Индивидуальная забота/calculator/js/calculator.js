/**
 * calculator.js — модуль состояния и логики калькулятора
 *
 * Отвечает за хранение текущего состояния и выполнение вычислений.
 * Не взаимодействует с DOM напрямую.
 */

/** @typedef {{ operand: string, operator: string|null, result: string, justEvaled: boolean }} CalcState */

/** Начальное состояние */
const INITIAL_STATE = {
  operand:    '0',   // текущий операнд (строка)
  operator:   null,  // выбранный оператор: '+', '−', '×', '÷'
  prevOperand:'',    // предыдущий операнд (до оператора)
  result:     '0',   // отображаемый результат
  justEvaled: false, // был ли только что нажат «=»
};

let state = { ...INITIAL_STATE };

/** Возвращает копию текущего состояния */
export const getState = () => ({ ...state });

/** Сбрасывает состояние до начального */
export const reset = () => { state = { ...INITIAL_STATE }; };

/**
 * Вводит цифру или «0».
 * @param {string} digit
 */
export const inputDigit = (digit) => {
  // После «=» начинаем новое выражение
  if (state.justEvaled) {
    state.prevOperand = '';
    state.operator    = null;
    state.justEvaled  = false;
    state.operand     = digit === '0' ? '0' : digit;
  } else if (state.operand === '0') {
    state.operand = digit === '0' ? '0' : digit;
  } else {
    if (state.operand.replace('-', '').length >= 12) return; // лимит цифр
    state.operand += digit;
  }
  state.result = state.operand;
};

/**
 * Добавляет десятичную точку.
 */
export const inputDot = () => {
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

/**
 * Устанавливает оператор.
 * @param {string} op — один из: '+', '−', '×', '÷'
 * @returns {string|null} ошибка или null
 */
export const setOperator = (op) => {
  if (state.operator && !state.justEvaled && state.prevOperand !== '') {
    // Применяем промежуточный результат
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

/**
 * Вычисляет результат.
 * @returns {string|null} сообщение об ошибке или null
 */
export const evaluate = () => {
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

  // Ограничиваем точность, убираем лишние нули
  const formatted = parseFloat(res.toPrecision(12)).toString();

  state.result     = formatted;
  state.operand    = formatted;
  state.prevOperand= '';
  state.operator   = null;
  state.justEvaled = true;

  return null;
};

/**
 * Удаляет последний символ операнда.
 */
export const backspace = () => {
  if (state.justEvaled) return; // после «=» не стираем результат
  if (state.operand.length <= 1 || state.operand === '-0') {
    state.operand = '0';
  } else {
    state.operand = state.operand.slice(0, -1);
  }
  state.result = state.operand;
};

/**
 * Меняет знак текущего операнда.
 */
export const toggleSign = () => {
  if (state.operand === '0') return;
  state.operand = state.operand.startsWith('-')
    ? state.operand.slice(1)
    : '-' + state.operand;
  state.result = state.operand;
};

/**
 * Вычисляет процент от предыдущего значения (или просто /100).
 */
export const percent = () => {
  const n = parseFloat(state.operand);
  if (isNaN(n)) return;
  const prev = parseFloat(state.prevOperand);
  const val  = !isNaN(prev) && state.operator
    ? (prev * n) / 100
    : n / 100;
  state.operand = parseFloat(val.toPrecision(12)).toString();
  state.result  = state.operand;
};

/**
 * Строит строку выражения для дисплея.
 * @returns {string}
 */
export const getExpression = () => {
  if (!state.operator) return '';
  return `${state.prevOperand} ${state.operator}`;
};
