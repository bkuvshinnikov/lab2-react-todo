# Auth API

Текущие endpoint’ы:

- `POST /api/auth/register` — создаёт пользователя; пароль сохраняется как scrypt-хеш.
- `POST /api/auth/login` — принимает `email` и `password`, создаёт семидневную сессию и устанавливает HttpOnly cookie `task_manager_session`.
- `POST /api/auth/logout` — удаляет текущую сессию и очищает cookie.

В коллекции `sessions` хранится хеш токена, а не сам токен. Индекс TTL удаляет
сессии после `expiresAt`. Cookie использует `SameSite=Lax`, `Secure` в production
и путь `/`. Регистрация намеренно не выполняет автоматический вход: клиент может
показать подтверждение регистрации, после чего пользователь входит отдельно.

Проверка текущей сессии и middleware для защиты страниц появятся на следующем
шаге, перед переносом задач из localStorage в MongoDB.
