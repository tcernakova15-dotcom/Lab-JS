# Transaction Analyzer

Консольное приложение для анализа финансовых транзакций на JavaScript.

## Запуск

```bash
node main.js
```

---

## Структура транзакции

| Поле | Тип | Описание |
|------|-----|----------|
| `transaction_id` | string | Уникальный идентификатор |
| `transaction_date` | string | Дата в формате `YYYY-MM-DD` |
| `transaction_amount` | number | Сумма транзакции |
| `transaction_type` | string | Тип: `debit` или `credit` |
| `transaction_description` | string | Описание |
| `merchant_name` | string | Название магазина / сервиса |
| `card_type` | string | Тип карты: `debit` или `credit` |

---

## Описание функций

### `getUniqueTransactionTypes(transactions)`
Возвращает массив уникальных типов транзакций.  
Использует `Set`, чтобы автоматически убрать дубликаты, затем spread-оператор `...` превращает `Set` обратно в массив.

```js
getUniqueTransactionTypes(transactions);
// => ["debit", "credit"]
```

---

### `calculateTotalAmount(transactions)`
Считает и возвращает сумму всех транзакций.  
Использует `reduce`, который проходит по массиву и накапливает итог в переменной `sum`.

```js
calculateTotalAmount(transactions);
// => 13100.0
```

---

### `calculateTotalAmountByDate(transactions, year?, month?, day?)`
Считает сумму транзакций за указанный период. Все параметры даты необязательны — можно передать только год, только месяц, или любую комбинацию.  
Внутри фильтрует транзакции по совпадению даты, затем считает сумму через `calculateTotalAmount`.

```js
calculateTotalAmountByDate(transactions, 2025, 5);
// => 1000  

 getTransactionsByType(transactions, type)
Возвращает транзакции указанного типа.
Пример:
getTransactionsByType(transactions, "debit");


getTransactionsByDateRange(transactions, startDate, endDate)
Возвращает транзакции в диапазоне дат.
Пример:
getTransactionsByDateRange(transactions, "2026-09-01", "2026-12-31");


getTransactionsByMerchant(transactions, merchantName)
Возвращает транзакции по магазину/сервису.
Пример:
getTransactionsByMerchant(transactions, "USM");


calculateAverageAmount(transactions)
Возвращает среднее значение суммы транзакций.
Пример:
calculateAverageAmount(transactions); // => 1310.0


getTransactionsByAmountRange(transactions, minAmount, maxAmount)
Возвращает транзакции по диапазону суммы.
Пример:
getTransactionsByAmountRange(transactions, 500, 1500);


calculateTotalDebitAmount(transactions)
Считает общую сумму дебетовых транзакций.
Пример:
calculateTotalDebitAmount(transactions); // => 5600.0


getMonthWithMostTransactions(transactions)
Возвращает месяц с максимальным количеством транзакций.
Пример:
getMonthWithMostTransactions(transactions);


getMonthWithMostDebitTransactions(transactions)
Возвращает месяц с максимальным количеством дебетовых транзакций.
Пример:
getMonthWithMostDebitTransactions(transactions);


getMostFrequentTransactionType(transactions)
Определяет, каких транзакций больше: debit или credit.
Пример:
getMostFrequentTransactionType(transactions); // => "debit"


getTransactionsBeforeDate(transactions, date)
Возвращает транзакции до указанной даты.
Пример:
getTransactionsBeforeDate(transactions, "2026-01-01");


getTransactionById(transactions, id)
Находит транзакцию по её ID.
Пример:
getTransactionById(transactions, "5");


getTransactionDescriptions(transactions)
Возвращает массив описаний транзакций.
Пример:
getTransactionDescriptions(transactions);



 Тесты
console.log("1. Уникальные типы:", getUniqueTransactionTypes(transactions));
// => ["debit", "credit"]

console.log("2. Общая сумма:", calculateTotalAmount(transactions));
// => 13100.0

console.log("7. Средний чек:", calculateAverageAmount(transactions));
// => 1310.0

console.log("12. Частый тип:", getMostFrequentTransactionType(transactions));
// => "debit"

console.log("15. Описания:", getTransactionDescriptions(transactions));
// => массив строк с описаниями транзакций



 Контрольные вопросы
- Какие методы массивов используются?
map(), filter(), reduce(), forEach(), find()
- Как сравниваются даты?
Через объект Date и операторы <, >, <=, >=.
- Разница между map(), filter() и reduce()?
- map() — преобразует каждый элемент массива.
- filter() — отбирает элементы по условию.
- reduce() — сворачивает массив в одно итоговое значение.
В чем разница между map(), filter() и reduce() при работе с массивами объектов?
Разница между map(), filter() и reduce() заключается в том, что они выполняют разные операции над массивами: map() преобразует каждый элемент, filter() отбирает элементы по условию, а reduce() сворачивает массив в одно итоговое значение.
Ключевые различия:
- map() всегда возвращает массив той же длины, но с преобразованными элементами.
- filter() возвращает массив меньшей длины, так как исключает элементы, не подходящие под условие.
- reduce() возвращает одно значение — это может быть число, строка, объект или даже новый массив, если так запрограммировать.

 Выводы:
Программа реализует полный набор функций для анализа транзакций: поиск по типу, дате, магазину, диапазону суммы, вычисление общей и средней суммы, определение месяца с максимальным количеством операций и извлечение описаний.
Использование встроенных методов массивов делает код компактным, читаемым и легко расширяемым. Тесты подтверждают корректность работы функций.
