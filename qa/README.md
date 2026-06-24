# Документация по тестированию проекта KazWonder

В этой папке лежат материалы по тестированию бэкенда для проекта KazWonder (FastAPI + SQLAlchemy + SQLite). Я сделал это для демонстрации того, как подхожу к проверке API, составлению тест-кейсов и оформлению багов. 

## Структура папки

*   [checklists/](./checklists) - чек-листы для быстрой проверки модулей.
    *   [subscribe_checklist.md](./checklists/subscribe_checklist.md) - проверки для эндпоинта подписки (POST /api/subscribe).
*   [test_cases/](./test_cases) - детальные тест-кейсы с шагами воспроизведения.
    *   [subscribe_test_cases.md](./test_cases/subscribe_test_cases.md) - кейс повторной подписки и проверки таймаута.
*   [bug_reports/](./bug_reports) - отчеты о найденных ошибках в API.
    *   [BUG-001_negative_participants.md](./bug_reports/BUG-001_negative_participants.md) - баг с возможностью заказать тур на отрицательное число участников в POST /api/orders.

## Как тестировал

Все проверки API делал вручную через Postman. Проверял HTTP-статусы, JSON-ответы, а также напрямую смотрел изменения в таблицах базы данных, чтобы убедиться, что логика сработала правильно. Для закрытых эндпоинтов использовал авторизацию через Bearer токены.
