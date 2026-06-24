# БАГ-РЕПОРТ: BUG-001

## Заголовок
Возможность оформить заказ с отрицательным количеством участников (participants_count) через POST /api/orders, что приводит к отрицательной стоимости заказа и увеличению свободных мест.

## Окружение
*   **Стенд:** Локальный бэкенд (FastAPI)
*   **База данных:** SQLite / PostgreSQL
*   **Инструмент тестирования:** Postman
*   **Заголовки запроса:**
    *   Content-Type: application/json
    *   Authorization: Bearer [токен авторизации]

## Параметры дефекта
*   **Серьезность (Severity):** Критическая (Critical). Ломает финансовую логику и логику работы с местами в БД.
*   **Приоритет (Priority):** Высокий (High). Нужно поправить перед релизом.

## Шаги воспроизведения
1. Зарегистрироваться в системе или залогиниться под существующим пользователем, получить Bearer токен.
2. Открыть Postman и создать POST запрос на http://localhost:8000/api/orders.
3. Добавить полученный токен в заголовок Authorization (тип Bearer).
4. Передать в теле запроса (JSON) отрицательное число участников:
    ```json
    {
      "tour_id": "baikonur",
      "booking_date_id": 3,
      "participants_count": -5,
      "primary_traveler": {
        "firstName": "Test",
        "lastName": "Test",
        "email": "test@gmail.com",
        "phone": "+7 (777) 777-77-77",
        "dob": "2000-01-24",
        "gender": "male"
      },
      "additional_travelers": []
    }
    ```
5. Отправить запрос.

## Фактический результат
1. **Ответ API:** Сервер вернул статус 200 OK и ID созданного заказа.
    ```json
    {
      "order_id": 14
    }
    ```
2. **В базе данных (таблица orders):** Создалась запись со следующими значениями:
    *   participants_count = -5
    *   total_amount = -300000 (цена тура умножилась на -5)
    *   prepayment_amount = -50000
3. **В базе данных (таблица booking_dates):** Свободные места увеличились вместо уменьшения. Было 10 свободных мест, после заказа стало 15 (из-за выполнения логики seats -= -5).

## Ожидаемый результат
1. **Ответ API:** Сервер должен вернуть статус 422 Unprocessable Entity.
2. **В ответе:** Сообщение об ошибке валидации (что participants_count должно быть больше нуля).
3. **В базе данных:** Заказ не должен создаваться, свободные места в туре не должны меняться.

## Вариант исправления
В схеме запроса OrderCreate (файл app/schemas/order.py) нужно добавить ограничение Field(gt=0) для поля participants_count:

```python
from pydantic import BaseModel, Field

class OrderCreate(BaseModel):
    tour_id: str
    booking_date_id: int
    participants_count: int = Field(gt=0, description="Должно быть больше 0")
    primary_traveler: PrimaryTraveler
    additional_travelers: AdditionalTravelers | None = None
```
