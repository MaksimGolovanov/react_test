export const mockArticles = [
    {
        id: 1,
        title: 'Основы React для начинающих',
        slug: 'osnovy-react-dlya-nachinayushchikh',
        content: `
# Основы React

React - это JavaScript-библиотека для создания пользовательских интерфейсов.

## Основные понятия:

### 1. Компоненты
Компоненты - это строительные блоки React-приложения.

### 2. JSX
JSX - это расширение синтаксиса JavaScript.

### 3. Состояние (State)
Состояние - это данные, которые могут меняться в компоненте.

### 4. Пропсы (Props)
Пропсы - это параметры, передаваемые компоненту.

## Пример кода:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Вы нажали {count} раз</p>
            <button onClick={() => setCount(count + 1)}>
                Нажми на меня
            </button>
        </div>
    );
}
\`\`\`
        `,
        description: 'Введение в React для новичков с примерами кода',
        category_id: 1,
        category: { id: 1, name: 'Frontend' },
        author: 'Иван Петров',
        tags: ['React', 'JavaScript', 'Frontend', 'Начинающим'],
        content_type: 'Статья',
        status: 'published',
        featured: true,
        views: 2450,
        rating: 4.8,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-02-20T14:15:00Z',
        meta_title: 'Основы React - руководство для начинающих',
        meta_description: 'Изучите основы React с нуля. Компоненты, состояние, пропсы и JSX с примерами.',
        meta_keywords: 'React, JavaScript, обучение, компоненты, фронтенд'
    },
    {
        id: 2,
        title: 'Оптимизация производительности PostgreSQL',
        slug: 'optimizatsiya-proizvoditelnosti-postgresql',
        content: `
# Оптимизация PostgreSQL

PostgreSQL - мощная реляционная база данных. Вот основные способы оптимизации:

## 1. Индексы
Правильное использование индексов ускоряет запросы в 100 раз.

### Типы индексов:
- B-tree (стандартный)
- Hash
- GiST
- SP-GiST
- GIN
- BRIN

## 2. Настройка параметров
Важные параметры в postgresql.conf:
- shared_buffers (25% от RAM)
- effective_cache_size (75% от RAM)
- work_mem
- maintenance_work_mem

## 3. Мониторинг
Используйте:
- pg_stat_statements
- EXPLAIN ANALYZE
- pgBadger для анализа логов

## Пример индекса:
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_date ON orders USING brin(order_date);
\`\`\`
        `,
        description: 'Советы по оптимизации и настройке PostgreSQL',
        category_id: 3,
        category: { id: 3, name: 'Базы данных' },
        author: 'Анна Сидорова',
        tags: ['PostgreSQL', 'Базы данных', 'Оптимизация', 'DevOps'],
        content_type: 'Инструкция',
        status: 'published',
        featured: true,
        views: 1800,
        rating: 4.9,
        created_at: '2024-02-10T09:20:00Z',
        updated_at: '2024-03-05T11:45:00Z',
        meta_title: 'Оптимизация PostgreSQL - лучшие практики',
        meta_description: 'Полное руководство по оптимизации производительности PostgreSQL',
        meta_keywords: 'PostgreSQL, оптимизация, базы данных, индексы'
    },
    {
        id: 3,
        title: 'Настройка CI/CD с GitLab',
        slug: 'nastrojka-ci-cd-s-gitlab',
        content: `
# CI/CD с GitLab

Непрерывная интеграция и доставка (CI/CD) - ключевая практика DevOps.

## Этапы конвейера:

### 1. Build (Сборка)
\`\`\`yaml
build:
  stage: build
  script:
    - npm install
    - npm run build
\`\`\`

### 2. Test (Тестирование)
\`\`\`yaml
test:
  stage: test
  script:
    - npm test
    - npm run lint
\`\`\`

### 3. Deploy (Развертывание)
\`\`\`yaml
deploy:
  stage: deploy
  script:
    - scp -r build/* user@server:/var/www/app
\`\`\`

## Лучшие практики:
1. Кэширование зависимостей
2. Параллельное выполнение тестов
3. Автоматическое развертывание на staging
4. Мануальное подтверждение для production
        `,
        description: 'Руководство по настройке CI/CD пайплайна в GitLab',
        category_id: 2,
        category: { id: 2, name: 'DevOps' },
        author: 'Сергей Козлов',
        tags: ['GitLab', 'CI/CD', 'DevOps', 'Docker'],
        content_type: 'Руководство',
        status: 'published',
        featured: false,
        views: 1250,
        rating: 4.5,
        created_at: '2024-01-28T14:00:00Z',
        updated_at: '2024-02-15T16:30:00Z',
        meta_title: 'Настройка CI/CD GitLab для DevOps',
        meta_description: 'Пошаговое руководство по настройке CI/CD в GitLab',
        meta_keywords: 'GitLab, CI/CD, DevOps, автоматизация'
    },
    {
        id: 4,
        title: 'Микросервисная архитектура на Node.js',
        slug: 'mikroservisnaya-arkhitektura-na-nodejs',
        content: `
# Микросервисы на Node.js

## Преимущества:
1. Независимое развертывание
2. Технологическая гетерогенность
3. Масштабируемость
4. Устойчивость к отказам

## Архитектура:
- API Gateway
- Сервис авторизации
- Сервис пользователей
- Сервис заказов
- Сервис оплаты

## Коммуникация:
1. HTTP/REST
2. gRPC
3. Message Queue (RabbitMQ, Kafka)

## Пример сервиса:
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/users/:id', async (req, res) => {
    const user = await UserService.getById(req.params.id);
    res.json(user);
});

module.exports = app;
\`\`\`
        `,
        description: 'Принципы построения микросервисной архитектуры',
        category_id: 4,
        category: { id: 4, name: 'Backend' },
        author: 'Дмитрий Иванов',
        tags: ['Node.js', 'Микросервисы', 'Архитектура', 'Backend'],
        content_type: 'Статья',
        status: 'published',
        featured: true,
        views: 2100,
        rating: 4.7,
        created_at: '2024-02-05T11:15:00Z',
        updated_at: '2024-03-01T10:20:00Z',
        meta_title: 'Микросервисы на Node.js - практическое руководство',
        meta_description: 'Создание микросервисной архитектуры с использованием Node.js',
        meta_keywords: 'Node.js, микросервисы, архитектура, бэкенд'
    },
    {
        id: 5,
        title: 'Введение в Docker и контейнеризацию',
        slug: 'vvedenie-v-docker-i-kontejnerizatsiyu',
        content: `
# Docker для начинающих

## Что такое Docker?
Docker - платформа для контейнеризации приложений.

## Основные команды:

### Запуск контейнера
\`\`\`bash
docker run -d -p 80:80 nginx
\`\`\`

### Список контейнеров
\`\`\`bash
docker ps
docker ps -a
\`\`\`

### Сборка образа
\`\`\`bash
docker build -t myapp:latest .
\`\`\`

## Dockerfile пример:
\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`
        `,
        description: 'Базовое руководство по работе с Docker',
        category_id: 2,
        category: { id: 2, name: 'DevOps' },
        author: 'Мария Смирнова',
        tags: ['Docker', 'Контейнеризация', 'DevOps', 'Начинающим'],
        content_type: 'Руководство',
        status: 'published',
        featured: false,
        views: 950,
        rating: 4.3,
        created_at: '2024-02-18T13:45:00Z',
        updated_at: '2024-02-25T09:30:00Z',
        meta_title: 'Docker для начинающих - полное руководство',
        meta_description: 'Изучите Docker с нуля: установка, основные команды, создание образов',
        meta_keywords: 'Docker, контейнеризация, DevOps, руководство'
    },
    {
        id: 6,
        title: 'Лучшие практики TypeScript',
        slug: 'luchshie-praktiki-typescript',
        content: `
# TypeScript Best Practices

## 1. Строгая типизация
Всегда используйте \`strict: true\` в tsconfig.json

## 2. Интерфейсы vs Типы
Используйте интерфейсы для объектов, типы для объединений

## 3. Generics
\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`

## 4. Utility Types
- \`Partial<T>\`
- \`Required<T>\`
- \`Pick<T, K>\`
- \`Omit<T, K>\`

## 5. Обработка ошибок
\`\`\`typescript
try {
    // код
} catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    }
}
\`\`\`
        `,
        description: 'Рекомендации по написанию качественного TypeScript кода',
        category_id: 1,
        category: { id: 1, name: 'Frontend' },
        author: 'Алексей Новиков',
        tags: ['TypeScript', 'JavaScript', 'Frontend', 'Best Practices'],
        content_type: 'Статья',
        status: 'published',
        featured: false,
        views: 1100,
        rating: 4.6,
        created_at: '2024-01-20T16:20:00Z',
        updated_at: '2024-02-10T12:10:00Z',
        meta_title: 'Лучшие практики TypeScript для разработчиков',
        meta_description: 'Советы и рекомендации по написанию TypeScript кода',
        meta_keywords: 'TypeScript, JavaScript, frontend, best practices'
    },
    {
        id: 7,
        title: 'Настройка Nginx для production',
        slug: 'nastrojka-nginx-dlya-production',
        content: `
# Production настройка Nginx

## Базовая конфигурация:
\`\`\`nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
\`\`\`

## Оптимизация:
1. Gzip сжатие
2. Кэширование статики
3. Rate limiting
4. SSL/TLS настройка

## Мониторинг:
- access_log
- error_log
- stub_status модуль
        `,
        description: 'Рекомендации по настройке Nginx для production окружения',
        category_id: 5,
        category: { id: 5, name: 'Системное администрирование' },
        author: 'Павел Волков',
        tags: ['Nginx', 'Production', 'DevOps', 'Сервер'],
        content_type: 'Инструкция',
        status: 'draft',
        featured: false,
        views: 300,
        rating: null,
        created_at: '2024-03-01T15:30:00Z',
        updated_at: '2024-03-01T15:30:00Z',
        meta_title: 'Настройка Nginx для production сервера',
        meta_description: 'Оптимальная конфигурация Nginx для продакшн окружения',
        meta_keywords: 'Nginx, production, сервер, настройка'
    },
    {
        id: 8,
        title: 'React Hooks: полное руководство',
        slug: 'react-hooks-polnoe-rukovodstvo',
        content: `
# React Hooks Guide

## Основные хуки:

### useState
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`jsx
useEffect(() => {
    // side effects
    return () => {
        // cleanup
    };
}, [dependencies]);
\`\`\`

### useContext
\`\`\`jsx
const value = useContext(MyContext);
\`\`\`

## Кастомные хуки:
\`\`\`javascript
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
    };
    
    return [storedValue, setValue];
}
\`\`\`
        `,
        description: 'Подробное руководство по использованию React Hooks',
        category_id: 1,
        category: { id: 1, name: 'Frontend' },
        author: 'Ирина Кузнецова',
        tags: ['React', 'Hooks', 'Frontend', 'JavaScript'],
        content_type: 'Статья',
        status: 'published',
        featured: true,
        views: 3200,
        rating: 4.9,
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-02-28T13:20:00Z',
        meta_title: 'React Hooks - полное руководство с примерами',
        meta_description: 'Изучите все React Hooks с подробными примерами использования',
        meta_keywords: 'React, hooks, useState, useEffect, useContext'
    },
    {
        id: 9,
        title: 'Мониторинг приложений с Prometheus',
        slug: 'monitoring-prilozhenij-s-prometheus',
        content: `
# Prometheus мониторинг

## Архитектура:
1. Prometheus Server
2. Exporters (Node, MySQL, Redis)
3. Alertmanager
4. Grafana для визуализации

## Конфигурация:
\`\`\`yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
\`\`\`

## Метрики:
- CPU использование
- Память
- HTTP запросы
- Бизнес метрики

## Alert правила:
\`\`\`yaml
groups:
  - name: example
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status="500"}[5m]) > 0.1
        for: 5m
\`\`\`
        `,
        description: 'Настройка мониторинга приложений с использованием Prometheus',
        category_id: 2,
        category: { id: 2, name: 'DevOps' },
        author: 'Андрей Соколов',
        tags: ['Prometheus', 'Мониторинг', 'DevOps', 'Grafana'],
        content_type: 'Руководство',
        status: 'archived',
        featured: false,
        views: 750,
        rating: 4.2,
        created_at: '2023-12-05T11:00:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        meta_title: 'Мониторинг приложений с Prometheus и Grafana',
        meta_description: 'Полное руководство по настройке мониторинга',
        meta_keywords: 'Prometheus, мониторинг, Grafana, DevOps'
    },
    {
        id: 10,
        title: 'GraphQL vs REST: сравнение API',
        slug: 'graphql-vs-rest-sravnenie-api',
        content: `
# GraphQL vs REST

## REST:
### Преимущества:
- Простота
- Кэширование
- Стандартизация

### Недостатки:
- Over-fetching
- Under-fetching
- Множество запросов

## GraphQL:
### Преимущества:
- Один endpoint
- Точный запрос данных
- Строгая типизация
- Интроспекция

### Недостатки:
- Сложность
- Проблемы с кэшированием
- N+1 проблема

## Пример GraphQL запроса:
\`\`\`graphql
query {
  user(id: "1") {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}
\`\`\`
        `,
        description: 'Сравнение REST и GraphQL подходов к построению API',
        category_id: 4,
        category: { id: 4, name: 'Backend' },
        author: 'Екатерина Морозова',
        tags: ['GraphQL', 'REST', 'API', 'Backend'],
        content_type: 'Статья',
        status: 'published',
        featured: false,
        views: 890,
        rating: 4.4,
        created_at: '2024-02-15T10:45:00Z',
        updated_at: '2024-02-22T16:10:00Z',
        meta_title: 'GraphQL vs REST - что выбрать для вашего проекта',
        meta_description: 'Подробное сравнение REST и GraphQL подходов',
        meta_keywords: 'GraphQL, REST, API, сравнение'
    }
];