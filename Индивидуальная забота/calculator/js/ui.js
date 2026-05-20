/**
 * ui.js — модуль отображения (рендер DOM)
 *
 * Синхронизирует состояние калькулятора с интерфейсом.
 * Получает данные через аргументы, не импортирует логику напрямую.
 */

// Ссылки на DOM-элементы
const elExpression = /** @type {HTMLElement} */ (document.getElementById('expression'));
const elResult     = /** @type {HTMLElement} */ (document.getElementById('result'));
const elError      = /** @type {HTMLElement} */ (document.getElementById('error-msg'));
const elHistory    = /** @type {HTMLElement} */ (document.getElementById('history'));

/**
 * Обновляет дисплей.
 * @param {{ expression: string, result: string, justEvaled: boolean }} data
 */
export const renderDisplay = ({ expression, result, justEvaled }) => {
  elExpression.textContent = expression;
  elResult.textContent     = result;
  elResult.classList.toggle('has-result', justEvaled);
};

/**
 * Выводит сообщение об ошибке (автоматически скрывается через 2 с).
 * @param {string} msg
 */
export const showError = (msg) => {
  elError.textContent = msg;
  clearTimeout(showError._timer);
  showError._timer = setTimeout(() => { elError.textContent = ''; }, 2000);
};

/**
 * Подсвечивает активную кнопку оператора.
 * @param {string|null} op
 */
export const highlightOperator = (op) => {
  document.querySelectorAll('.btn-op').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === op);
  });
};

/**
 * Перерисовывает панель истории.
 * @param {Array<{expression: string, result: string}>} entries
 */
export const renderHistory = (entries) => {
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

/**
 * Добавляет эффект «рябь» на кнопку.
 * @param {HTMLElement} btn
 */
export const ripple = (btn) => {
  btn.classList.remove('ripple');
  // Форсируем reflow чтобы анимация сработала повторно
  void btn.offsetWidth;
  btn.classList.add('ripple');
  setTimeout(() => btn.classList.remove('ripple'), 300);
};

/* Утилита: экранирование HTML */
const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
