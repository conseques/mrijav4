# Развертывание MriJa v4 (Production)

Так как наш бэкенд теперь использует **локальную базу данных SQLite** (`backend/data/mrija.db`) и **локальное хранилище картинок** (`backend/uploads/`), его **нельзя** развернуть на Vercel или Netlify (они удаляют файлы после каждого запроса).

Тебе обязательно нужен **Собственный сервер (VPS)**, например на Hostinger, DigitalOcean, Hetzner или AWS.

## Шаг 1: Подготовка сервера (Ubuntu)
Подключись к серверу по SSH и выполни эти команды:
```bash
# Обновляем сервер и ставим нужные программы
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx unzip

# Устанавливаем Node.js (Версия 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Устанавливаем PM2 (Менеджер процессов для бэкенда)
sudo npm install -g pm2
```

## Шаг 2: Клонирование и настройка Бэкенда
```bash
# Клонируем проект (или перенеси файлы через FTP)
git clone <твой_ссылка_на_github> /var/www/mrijav4
cd /var/www/mrijav4

# Ставим зависимости бэкенда
cd backend
npm install
```

**Редактируем `backend/.env` для боя:**
```env
PORT=8080
JWT_SECRET=какой-то-очень-длинный-сложный-пароль
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://mrija.no,https://www.mrija.no
DATABASE_PATH=./data/mrija.db
BACKEND_PUBLIC_URL=https://api.mrija.no
```

**Запускаем бэкенд:**
```bash
pm2 start src/server.js --name mrija-backend
pm2 save
pm2 startup
```

## Шаг 3: Сборка Frontend
Открываем основной `.env` файл в корне проекта (`/var/www/mrijav4/.env`) и пишем:
```env
VITE_BACKEND_URL=https://api.mrija.no
```

**Собираем:**
```bash
cd /var/www/mrijav4
npm install
npm run build
```
*(Сборка появится в папке `/var/www/mrijav4/build/` или `dist/`)*

## Шаг 4: Настройка NGINX и Доменов
Нужно, чтобы в панели твоего хостинга (или регистратора доменов):
1. А-запись `mrija.no` (или твой сайт) смотрела на IP сервера.
2. А-запись `api.mrija.no` тоже смотрела на IP сервера.

Создай конфиг Nginx:
```bash
sudo nano /etc/nginx/sites-available/mrija
```

**Вставь туда это:**
```nginx
# FRONTEND (Сам сайт)
server {
    listen 80;
    server_name mrija.no www.mrija.no;
    root /var/www/mrijav4/build; # папка с собранным фронтом
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# BACKEND (API и Картинки)
server {
    listen 80;
    server_name api.mrija.no;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Важно для картинок (upload):
        client_max_body_size 10M; 
    }
}
```

Включи конфиг и перезапусти Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mrija /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Шаг 5: SSL Сертификаты (Обязательно для HTTPS!)
Бэкенд `api.mrija.no` и фронт `mrija.no` не могут работать по HTTP, нужен безопасный замок.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d mrija.no -d www.mrija.no
sudo certbot --nginx -d api.mrija.no
```

**ВСЁ!** Твой сайт на продакшене готов. Фронтенд работает по `https://mrija.no`, а все запросы отсылает на твой собственный `https://api.mrija.no`.
