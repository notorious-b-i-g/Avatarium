# Avatarium

Геймифицированный трекер задач, квестов и челленджей на Django: аватары, баланс,
еженедельные челленджи, счётчики и библиотека задач.

## Стек

- Python 3.12 / Django 5.1
- SQLite (по умолчанию) или PostgreSQL (через переменные окружения)
- Gunicorn, Docker / docker-compose

## Быстрый старт (локально)

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # заполните SECRET_KEY и т.д.
python manage.py migrate
python manage.py runserver
```

Приложение будет на http://127.0.0.1:8000

## Запуск в Docker

```bash
docker compose up --build
```

Поднимет Django (gunicorn) + PostgreSQL. Веб доступен на http://localhost:8000
Переменные `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` можно задать в окружении или `.env`.

## Переменные окружения

| Переменная | Назначение | По умолчанию |
|---|---|---|
| `SECRET_KEY` | Django secret key | — (обязательна) |
| `DEBUG` | Режим отладки (`True`/`False`) | `False` |
| `ALLOWED_HOSTS` | Хосты через запятую | `*` |
| `DB_ENGINE` | Бэкенд БД | `sqlite3` |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | Параметры PostgreSQL | — |

Файлы `media/` (загрузки пользователей) и `db.sqlite3` в репозиторий не коммитятся.
