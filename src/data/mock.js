// ============================================================
// MOCK DATA FOR FANZILLA ADMIN PANEL PROTOTYPE
// Reactive per-workspace data — auto-switches when workspace changes
// ============================================================
import { reactive, watch } from 'vue'
import { currentWorkspaceId, selectedVenueFilter } from '../stores/workspace.js'

// ============================================================
// STATIC DATA (same across all workspaces)
// ============================================================

export const venueTypes = {
  stadium: 'Стадион / Арена',
  rink: 'Каток',
  pool: 'Бассейн / Аквакомплекс',
  concert: 'Концертная площадка',
  entertainment: 'Развлекательный центр',
  open: 'Открытая площадка'
}

export const venueStatuses = {
  draft: { label: 'Черновик', type: 'default' },
  active: { label: 'Активен', type: 'success' },
  paused: { label: 'Приостановлен', type: 'warning' },
  archived: { label: 'Архив', type: 'error' }
}

export const eventTypes = [
  { value: 'session', label: 'Сеанс', icon: '🛼' },
  { value: 'match', label: 'Спортивный матч', icon: '⚽' },
  { value: 'standard', label: 'Стандартное', icon: '🎵' }
]

export const eventStatuses = {
  draft: { label: 'Черновик', type: 'default' },
  published: { label: 'Опубликовано', type: 'success' },
  paused: { label: 'Приостановлено', type: 'warning' },
  completed: { label: 'Завершено', type: 'info' },
  cancelled: { label: 'Отменено', type: 'error' }
}

export const orderStatuses = {
  created: { label: 'Создан', type: 'warning' },
  paid: { label: 'Оплачен', type: 'success' },
  partial_refund: { label: 'Частично возвращён', type: 'warning' },
  refunded: { label: 'Возвращён', type: 'error' },
  cancelled: { label: 'Отменён', type: 'default' }
}

export const ticketStatuses = {
  active: { label: 'Активен', type: 'success' },
  used: { label: 'Использован', type: 'info' },
  refunded: { label: 'Возвращён', type: 'error' },
  cancelled: { label: 'Отменён', type: 'default' },
  blocked: { label: 'Заблокирован', type: 'warning' },
  expired: { label: 'Просрочен', type: 'default' },
}

export const salesChannels = [
  { value: 'web', label: 'Сайт' },
  { value: 'app', label: 'Мобильное приложение' },
  { value: 'pos', label: 'Касса' },
  { value: 'partner', label: 'Партнёр' },
]

// ============================================================
// WORKSPACE 1: Каток Лужники
// ============================================================
const ws1 = {
  venues: [
    { id: 1, name: 'Основной каток', type: 'rink', address: 'Лужнецкая наб., 24, стр. 4, Москва', city: 'Москва', status: 'active', capacity: 400, zones: 3, events: 47, yandexMaps: 'https://yandex.ru/maps/org/1234' },
    { id: 2, name: 'Тренировочный каток', type: 'rink', address: 'Лужнецкая наб., 24, стр. 5, Москва', city: 'Москва', status: 'active', capacity: 100, zones: 1, events: 12, yandexMaps: 'https://yandex.ru/maps/org/1235' },
  ],
  events: [
    { id: 1, name: 'Массовое катание 10:00', type: 'session', venue: 1, venueName: 'Основной каток', date: '2025-03-15', timeStart: '10:00', timeEnd: '10:45', duration: 45, status: 'published', sold: 120, capacity: 200, pricingTemplate: 1 },
    { id: 2, name: 'Массовое катание 11:00', type: 'session', venue: 1, venueName: 'Основной каток', date: '2025-03-15', timeStart: '11:00', timeEnd: '11:45', duration: 45, status: 'published', sold: 85, capacity: 200, pricingTemplate: 1 },
    { id: 3, name: 'Массовое катание 12:00', type: 'session', venue: 1, venueName: 'Основной каток', date: '2025-03-15', timeStart: '12:00', timeEnd: '12:45', duration: 45, status: 'published', sold: 164, capacity: 200, pricingTemplate: 1 },
    { id: 8, name: 'Вечерний сеанс 18:00', type: 'session', venue: 1, venueName: 'Основной каток', date: '2025-03-15', timeStart: '18:00', timeEnd: '19:30', duration: 90, status: 'published', sold: 190, capacity: 200, pricingTemplate: 2 },
    { id: 6, name: 'Массовое катание 10:00', type: 'session', venue: 1, venueName: 'Основной каток', date: '2025-03-16', timeStart: '10:00', timeEnd: '10:45', duration: 45, status: 'paused', sold: 0, capacity: 200, pricingTemplate: 1 },
    { id: 10, name: 'Массовое катание 14:00', type: 'session', venue: 1, venueName: 'Основной каток', date: '2025-03-17', timeStart: '14:00', timeEnd: '14:45', duration: 45, status: 'draft', sold: 0, capacity: 200, pricingTemplate: 1 },
    { id: 11, name: 'Фигурное катание (мастер-класс)', type: 'standard', venue: 2, venueName: 'Тренировочный каток', date: '2025-03-18', timeStart: '16:00', timeEnd: '18:00', duration: 120, status: 'published', sold: 45, capacity: 60, pricingTemplate: 4 },
    { id: 12, name: 'Хоккей для любителей', type: 'session', venue: 2, venueName: 'Тренировочный каток', date: '2025-03-20', timeStart: '20:00', timeEnd: '22:00', duration: 120, status: 'draft', sold: 18, capacity: 40, pricingTemplate: 5 },
  ],
  pricingTemplates: [
    { id: 1, name: 'Будни утро 10:00–12:00', status: 'active', eventsCount: 5 },
    { id: 2, name: 'Будни вечер', status: 'active', eventsCount: 5 },
    { id: 3, name: 'Выходные день', status: 'active', eventsCount: 8 },
    { id: 4, name: 'Мастер-класс', status: 'active', eventsCount: 2 },
    { id: 5, name: 'Любительский хоккей', status: 'active', eventsCount: 1 },
    { id: 6, name: 'Новогодний (2024)', status: 'archived', eventsCount: 0 },
  ],
  tariffs: [
    { id: 1, name: 'Стандартный', slug: 'standard', description: 'Базовый тариф', color: '#2080f0', sortOrder: 1, templatesCount: 7 },
    { id: 2, name: 'VIP', slug: 'vip', description: 'Премиум-доступ и привилегии', color: '#d03050', sortOrder: 2, templatesCount: 5 },
    { id: 3, name: 'Льготный', slug: 'discount', description: 'Пенсионеры, инвалиды, многодетные', color: '#f0a020', sortOrder: 3, templatesCount: 7 },
  ],
  ticketTypes: [
    { id: 1, name: 'Взрослый', slug: 'adult', channel: 'Все', description: 'от 14 лет', sortOrder: 1, templatesCount: 7 },
    { id: 2, name: 'Детский', slug: 'child', channel: 'Все', description: 'от 3 до 13 лет', sortOrder: 2, templatesCount: 7 },
    { id: 3, name: 'Семейный', slug: 'family', channel: 'Все', description: '2 взрослых + 2 детских', sortOrder: 3, templatesCount: 3 },
  ],
  services: [
    { id: 1, name: 'Прокат коньков', slug: 'skate', category: 'Прокат', icon: '🛼', description: 'Коньки любого размера на время сеанса', templatesCount: 7 },
    { id: 2, name: 'Пингвин', slug: 'penguin', category: 'Прокат', icon: '🐧', description: 'Опора для обучения катанию', templatesCount: 4 },
    { id: 3, name: 'Инструктор', slug: 'instructor', category: 'Обучение', icon: '👨‍🏫', description: 'Индивидуальное занятие с инструктором', templatesCount: 2 },
    { id: 4, name: 'Парковка', slug: 'parking', category: 'Сервис', icon: '🅿️', description: 'Парковочный талон на время визита', templatesCount: 0 },
    { id: 5, name: 'Заточка', slug: 'sharpening', category: 'Сервис', icon: '🔧', description: 'Заточка коньков', templatesCount: 5 },
  ],
  templatePrices: {
    1: {
      tickets: {
        1: { 1: 500, 2: 300, 3: 1400 },
        2: { 1: 1200, 2: 800 },
        3: { 1: 350, 2: 200 },
      },
      services: {
        1: { 1: { 1: 250, 2: 200 }, 2: { 1: 250, 2: 200 }, 3: { 1: 200, 2: 150 } },
        2: { 1: { 2: 150 }, 2: { 2: 150 }, 3: { 2: 100 } }
      }
    }
  },
  orders: [
    { id: 12345, date: '2024-12-15T14:32:00', customer: { name: 'Иван Петров', phone: '+7 (999) 123-45-67', email: 'ivan@email.com', segment: 'Постоянный клиент', ordersTotal: 12 }, event: 'Сеанс 17:00, 20 декабря', eventType: 'session', ticketsCount: 3, servicesCount: 2, total: 2430, discount: 270, promoCode: 'WINTER20', status: 'paid', channel: 'Сайт', paymentMethod: 'Карта **** 4567' },
    { id: 12346, date: '2024-12-15T15:10:00', customer: { name: 'Мария Сидорова', phone: '+7 (916) 555-12-34', email: 'maria@gmail.com', segment: 'Новый', ordersTotal: 1 }, event: 'Сеанс 17:00, 20 декабря', eventType: 'session', ticketsCount: 2, servicesCount: 1, total: 1500, discount: 0, promoCode: null, status: 'paid', channel: 'Сайт', paymentMethod: 'СБП' },
    { id: 12347, date: '2024-12-16T09:45:00', customer: { name: 'Алексей Козлов', phone: '+7 (903) 777-88-99', email: 'kozlov@yandex.ru', segment: 'VIP', ordersTotal: 28 }, event: 'Вечерний сеанс 18:00', eventType: 'session', ticketsCount: 4, servicesCount: 0, total: 4800, discount: 0, promoCode: null, status: 'paid', channel: 'Мобильное приложение', paymentMethod: 'Карта **** 1234' },
    { id: 12348, date: '2024-12-16T10:12:00', customer: { name: 'Ольга Новикова', phone: '+7 (926) 333-44-55', email: 'olga.n@mail.ru', segment: 'Постоянный клиент', ordersTotal: 8 }, event: 'Массовое катание 12:00', eventType: 'session', ticketsCount: 5, servicesCount: 4, total: 4200, discount: 420, promoCode: 'FAMILY10', status: 'partial_refund', channel: 'Сайт', paymentMethod: 'Карта **** 9876' },
    { id: 12349, date: '2024-12-16T11:30:00', customer: { name: 'Дмитрий Волков', phone: '+7 (977) 111-22-33', email: 'd.volkov@gmail.com', segment: 'Новый', ordersTotal: 1 }, event: 'Фигурное катание (мастер-класс)', eventType: 'standard', ticketsCount: 2, servicesCount: 0, total: 3000, discount: 0, promoCode: null, status: 'created', channel: 'Сайт', paymentMethod: null },
    { id: 12350, date: '2024-12-17T08:00:00', customer: { name: 'Анна Белова', phone: '+7 (905) 666-77-88', email: 'belova.anna@ya.ru', segment: 'Постоянный клиент', ordersTotal: 15 }, event: 'Массовое катание 10:00, 15 марта', eventType: 'session', ticketsCount: 1, servicesCount: 1, total: 750, discount: 0, promoCode: null, status: 'refunded', channel: 'Касса', paymentMethod: 'Наличные' },
    { id: 12351, date: '2024-12-17T12:45:00', customer: { name: 'Сергей Морозов', phone: '+7 (915) 444-55-66', email: 'morozov@inbox.ru', segment: 'Корпоративный', ordersTotal: 5 }, event: 'Массовое катание 12:00', eventType: 'session', ticketsCount: 10, servicesCount: 0, total: 5000, discount: 500, promoCode: 'CORP10', status: 'paid', channel: 'Партнёр', paymentMethod: 'Безналичный' },
    { id: 12352, date: '2024-12-18T16:20:00', customer: { name: 'Елена Кузнецова', phone: '+7 (968) 222-33-44', email: 'ekuz@gmail.com', segment: 'Новый', ordersTotal: 2 }, event: 'Хоккей для любителей', eventType: 'session', ticketsCount: 2, servicesCount: 0, total: 2400, discount: 0, promoCode: null, status: 'paid', channel: 'Сайт', paymentMethod: 'Карта **** 5555' },
  ],
  tickets: [
    { id: 'TKT-001234', orderId: 12345, event: 'Сеанс 17:00, 20 декабря', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 600, customer: 'Иван Петров', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001235', orderId: 12345, event: 'Сеанс 17:00, 20 декабря', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 600, customer: 'Иван Петров', status: 'used', entry: '17:05', exit: '19:12', sector: null, row: null, seat: null },
    { id: 'TKT-001236', orderId: 12345, event: 'Сеанс 17:00, 20 декабря', eventType: 'session', tariff: 'Стандартный', ticketType: 'Детский', price: 400, customer: 'Иван Петров', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001237', orderId: 12347, event: 'Вечерний сеанс 18:00', eventType: 'session', tariff: 'VIP', ticketType: 'Взрослый', price: 1200, customer: 'Алексей Козлов', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001238', orderId: 12347, event: 'Вечерний сеанс 18:00', eventType: 'session', tariff: 'VIP', ticketType: 'Взрослый', price: 1200, customer: 'Алексей Козлов', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001239', orderId: 12348, event: 'Массовое катание 12:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 500, customer: 'Ольга Новикова', status: 'used', entry: '12:02', exit: '12:40', sector: null, row: null, seat: null },
    { id: 'TKT-001240', orderId: 12348, event: 'Массовое катание 12:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Детский', price: 300, customer: 'Ольга Новикова', status: 'refunded', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001241', orderId: 12349, event: 'Фигурное катание (мастер-класс)', eventType: 'standard', tariff: 'Стандартный', ticketType: 'Взрослый', price: 1500, customer: 'Дмитрий Волков', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001242', orderId: 12352, event: 'Хоккей для любителей', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 1200, customer: 'Елена Кузнецова', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-001243', orderId: 12350, event: 'Массовое катание 10:00, 15 марта', eventType: 'session', tariff: 'Льготный', ticketType: 'Взрослый', price: 350, customer: 'Анна Белова', status: 'refunded', entry: null, exit: null, sector: null, row: null, seat: null },
  ],
  guests: [
    { id: 1, name: 'Иван Петров', phone: '+7 (999) 123-45-67', email: 'ivan@email.com', segment: 'Постоянный клиент', ordersCount: 12, totalSpent: 28500, lastVisit: '2024-12-20', registeredAt: '2024-03-15' },
    { id: 2, name: 'Мария Сидорова', phone: '+7 (916) 555-12-34', email: 'maria@gmail.com', segment: 'Новый', ordersCount: 1, totalSpent: 1500, lastVisit: '2024-12-20', registeredAt: '2024-12-15' },
    { id: 3, name: 'Алексей Козлов', phone: '+7 (903) 777-88-99', email: 'kozlov@yandex.ru', segment: 'VIP', ordersCount: 28, totalSpent: 156000, lastVisit: '2024-12-18', registeredAt: '2023-09-01' },
    { id: 4, name: 'Ольга Новикова', phone: '+7 (926) 333-44-55', email: 'olga.n@mail.ru', segment: 'Постоянный клиент', ordersCount: 8, totalSpent: 18200, lastVisit: '2024-12-15', registeredAt: '2024-01-20' },
    { id: 5, name: 'Дмитрий Волков', phone: '+7 (977) 111-22-33', email: 'd.volkov@gmail.com', segment: 'Новый', ordersCount: 1, totalSpent: 3000, lastVisit: null, registeredAt: '2024-12-16' },
    { id: 6, name: 'Сергей Морозов', phone: '+7 (915) 444-55-66', email: 'morozov@inbox.ru', segment: 'Корпоративный', ordersCount: 5, totalSpent: 67000, lastVisit: '2024-12-10', registeredAt: '2024-06-01' },
    { id: 7, name: 'Анна Белова', phone: '+7 (905) 666-77-88', email: 'belova.anna@ya.ru', segment: 'Постоянный клиент', ordersCount: 15, totalSpent: 35000, lastVisit: '2024-12-17', registeredAt: '2023-11-10' },
    { id: 8, name: 'Елена Кузнецова', phone: '+7 (968) 222-33-44', email: 'ekuz@gmail.com', segment: 'Новый', ordersCount: 2, totalSpent: 4800, lastVisit: '2024-12-18', registeredAt: '2024-12-01' },
  ],
  accessLog: [
    { id: 1, ticketId: 'TKT-001235', guest: 'Иван Петров', event: 'Сеанс 17:00, 20 декабря', zone: 'Главный вход', direction: 'in', time: '2024-12-20T17:05:00', device: 'Турникет №3', operator: 'Система' },
    { id: 2, ticketId: 'TKT-001235', guest: 'Иван Петров', event: 'Сеанс 17:00, 20 декабря', zone: 'Главный вход', direction: 'out', time: '2024-12-20T19:12:00', device: 'Турникет №1', operator: 'Система' },
    { id: 3, ticketId: 'TKT-001239', guest: 'Ольга Новикова', event: 'Массовое катание 12:00', zone: 'Главный вход', direction: 'in', time: '2025-03-15T12:02:00', device: 'Турникет №2', operator: 'Система' },
    { id: 4, ticketId: 'TKT-001239', guest: 'Ольга Новикова', event: 'Массовое катание 12:00', zone: 'Главный вход', direction: 'out', time: '2025-03-15T12:40:00', device: 'Турникет №4', operator: 'Система' },
  ],
  dashboardMetrics: {
    today: { revenue: 486000, revenueDelta: 12, ticketsSold: 342, ticketsSoldDelta: 8, avgCheck: 1421, avgCheckDelta: 3, occupancy: 78, occupancyDelta: -2, eventsToday: 8, activeOrders: 47, refundsToday: 3, passesToday: 289 },
    revenueChart: [
      { date: '03.01', value: 320000 }, { date: '03.02', value: 285000 }, { date: '03.03', value: 410000 },
      { date: '03.04', value: 380000 }, { date: '03.05', value: 290000 }, { date: '03.06', value: 520000 },
      { date: '03.07', value: 610000 }, { date: '03.08', value: 340000 }, { date: '03.09', value: 380000 },
      { date: '03.10', value: 420000 }, { date: '03.11', value: 350000 }, { date: '03.12', value: 460000 },
      { date: '03.13', value: 510000 }, { date: '03.14', value: 680000 }, { date: '03.15', value: 486000 },
    ],
    topEvents: [
      { name: 'Вечерний сеанс 18:00', date: '15.03', sold: 190, capacity: 200, revenue: 228000 },
      { name: 'Массовое катание 12:00', date: '15.03', sold: 164, capacity: 200, revenue: 82000 },
      { name: 'Массовое катание 10:00', date: '15.03', sold: 120, capacity: 200, revenue: 60000 },
      { name: 'Массовое катание 11:00', date: '15.03', sold: 85, capacity: 200, revenue: 42500 },
    ]
  },
  priceCategories: [
    { id: 1, venueId: 1, name: 'Павильон 1', color: '#2080f0', basePrice: 500, sectorsCount: 1, seatsCount: null, sortOrder: 1 },
    { id: 2, venueId: 1, name: 'Павильон 2', color: '#18a058', basePrice: 500, sectorsCount: 1, seatsCount: null, sortOrder: 2 },
    { id: 3, venueId: 1, name: 'Павильон 3', color: '#d03050', basePrice: 700, sectorsCount: 1, seatsCount: null, sortOrder: 3 },
  ],
  venueZones: [
    { id: 1, venueId: 1, name: 'Павильон 1', capacity: 150, priceCategoryName: 'Стандарт', status: 'active' },
    { id: 2, venueId: 1, name: 'Павильон 2', capacity: 150, priceCategoryName: 'Стандарт', status: 'active' },
    { id: 3, venueId: 1, name: 'Павильон 3', capacity: 100, priceCategoryName: 'VIP', status: 'active' },
  ],
  rentalItems: [
    { id: 1, ticketId: 'TKT-001235', guest: 'Иван Петров', item: 'Коньки размер 42', issuedAt: '2024-12-20T17:10:00', returnedAt: '2024-12-20T19:05:00', status: 'returned' },
    { id: 2, ticketId: 'TKT-001235', guest: 'Иван Петров', item: 'Заточка', issuedAt: '2024-12-20T17:15:00', returnedAt: null, status: 'completed' },
    { id: 3, ticketId: 'TKT-001239', guest: 'Ольга Новикова', item: 'Коньки размер 38', issuedAt: '2025-03-15T12:05:00', returnedAt: '2025-03-15T12:35:00', status: 'returned' },
    { id: 4, ticketId: 'TKT-001236', guest: 'Иван Петров', item: 'Пингвин', issuedAt: null, returnedAt: null, status: 'pending' },
  ],
  promoCodes: [
    { id: 1, code: 'WINTER20', type: 'percent', value: 20, usageLimit: 500, usageCount: 123, status: 'active', startDate: '2024-12-01', endDate: '2025-03-31' },
    { id: 2, code: 'FAMILY10', type: 'percent', value: 10, usageLimit: 200, usageCount: 45, status: 'active', startDate: '2024-11-01', endDate: '2025-04-30' },
    { id: 3, code: 'CORP10', type: 'percent', value: 10, usageLimit: 100, usageCount: 12, status: 'active', startDate: '2024-01-01', endDate: '2025-12-31' },
    { id: 4, code: 'ICE500', type: 'fixed', value: 500, usageLimit: 1000, usageCount: 890, status: 'active', startDate: '2024-06-01', endDate: '2025-06-01' },
    { id: 5, code: 'NEWYEAR24', type: 'percent', value: 30, usageLimit: 300, usageCount: 300, status: 'expired', startDate: '2024-12-20', endDate: '2025-01-10' },
  ],
  orderServices: [
    { id: 1, orderId: 12345, ticketId: 'TKT-001234', service: 'Прокат коньков', icon: '🛼', qty: 1, unitPrice: 250, total: 250 },
    { id: 2, orderId: 12345, ticketId: 'TKT-001236', service: 'Прокат коньков', icon: '🛼', qty: 1, unitPrice: 200, total: 200 },
    { id: 3, orderId: 12346, ticketId: 'TKT-020001', service: 'Прокат коньков', icon: '🛼', qty: 1, unitPrice: 250, total: 250 },
    { id: 4, orderId: 12348, ticketId: 'TKT-001239', service: 'Прокат коньков', icon: '🛼', qty: 1, unitPrice: 250, total: 250 },
    { id: 5, orderId: 12348, ticketId: 'TKT-001239', service: 'Заточка', icon: '🔧', qty: 1, unitPrice: 150, total: 150 },
    { id: 6, orderId: 12348, ticketId: 'TKT-001240', service: 'Прокат коньков', icon: '🛼', qty: 1, unitPrice: 200, total: 200 },
    { id: 7, orderId: 12348, ticketId: 'TKT-001240', service: 'Пингвин', icon: '🐧', qty: 1, unitPrice: 150, total: 150 },
    { id: 8, orderId: 12350, ticketId: 'TKT-001243', service: 'Прокат коньков', icon: '🛼', qty: 1, unitPrice: 200, total: 200 },
  ],
  addonOrders: [
    { id: 12360, parentOrderId: 12345, ticketId: 'TKT-001234', date: '2024-12-20T17:15:00', service: 'Заточка', icon: '🔧', qty: 1, unitPrice: 150, total: 150, status: 'paid', channel: 'Касса' },
    { id: 12361, parentOrderId: 12345, ticketId: 'TKT-001235', date: '2024-12-20T17:20:00', service: 'Пингвин', icon: '🐧', qty: 1, unitPrice: 150, total: 150, status: 'paid', channel: 'Касса' },
    { id: 12362, parentOrderId: 12348, ticketId: 'TKT-001239', date: '2025-03-15T18:10:00', service: 'Инструктор', icon: '👨‍🏫', qty: 1, unitPrice: 1500, total: 1500, status: 'paid', channel: 'Касса' },
  ],
  segments: [
    { id: 1, name: 'VIP', color: '#d03050', description: 'Высокий LTV, частые визиты', rules: 'Потрачено > 50 000 ₽ и визитов > 10', guestsCount: 1, totalRevenue: 156000, avgCheck: 5571, isAuto: true },
    { id: 2, name: 'Постоянный клиент', color: '#18a058', description: 'Регулярные посещения', rules: 'Визитов > 5 или потрачено > 15 000 ₽', guestsCount: 3, totalRevenue: 81700, avgCheck: 2334, isAuto: true },
    { id: 3, name: 'Новый', color: '#2080f0', description: 'Первый визит или недавняя регистрация', rules: 'Визитов ≤ 2 и зарегистрирован < 30 дней назад', guestsCount: 3, totalRevenue: 9300, avgCheck: 2325, isAuto: true },
    { id: 4, name: 'Корпоративный', color: '#f0a020', description: 'Корпоративные клиенты, групповые заказы', rules: 'Ручное присвоение менеджером', guestsCount: 1, totalRevenue: 67000, avgCheck: 13400, isAuto: false },
  ],
  teamMembers: [
    { id: 1, name: 'Александр Иванов', email: 'admin@fanzilla.ru', role: 'Владелец', status: 'active', lastActive: '2025-03-15T10:30:00' },
    { id: 2, name: 'Мария Петрова', email: 'maria@fanzilla.ru', role: 'Администратор', status: 'active', lastActive: '2025-03-15T09:15:00' },
    { id: 3, name: 'Дмитрий Сергеев', email: 'dmitry@fanzilla.ru', role: 'Менеджер билетов', status: 'active', lastActive: '2025-03-14T18:45:00' },
    { id: 4, name: 'Елена Николаева', email: 'elena@fanzilla.ru', role: 'Кассир', status: 'active', lastActive: '2025-03-15T08:00:00' },
    { id: 5, name: 'Сергей Козлов', email: 'sergey@fanzilla.ru', role: 'Контролёр', status: 'inactive', lastActive: '2025-02-28T17:00:00' },
  ],
}

// ============================================================
// WORKSPACE 2: Аквакомплекс Лужники
// ============================================================
const ws2 = {
  venues: [
    { id: 1, name: 'Большой бассейн', type: 'pool', address: 'Лужнецкая наб., 24, стр. 11, Москва', city: 'Москва', status: 'active', capacity: 200, zones: 4, events: 35, yandexMaps: 'https://yandex.ru/maps/org/2001' },
    { id: 2, name: 'Открытый бассейн', type: 'open', address: 'Лужнецкая наб., 24, стр. 12, Москва', city: 'Москва', status: 'active', capacity: 150, zones: 2, events: 18, yandexMaps: 'https://yandex.ru/maps/org/2002' },
    { id: 3, name: 'Детская зона', type: 'entertainment', address: 'Лужнецкая наб., 24, стр. 11А, Москва', city: 'Москва', status: 'active', capacity: 80, zones: 1, events: 10, yandexMaps: 'https://yandex.ru/maps/org/2003' },
  ],
  events: [
    { id: 1, name: 'Свободное плавание 08:00', type: 'session', venue: 1, venueName: 'Большой бассейн', date: '2025-03-15', timeStart: '08:00', timeEnd: '09:30', duration: 90, status: 'published', sold: 85, capacity: 120, pricingTemplate: 1 },
    { id: 2, name: 'Свободное плавание 10:00', type: 'session', venue: 1, venueName: 'Большой бассейн', date: '2025-03-15', timeStart: '10:00', timeEnd: '11:30', duration: 90, status: 'published', sold: 110, capacity: 120, pricingTemplate: 1 },
    { id: 3, name: 'Аквааэробика 12:00', type: 'standard', venue: 1, venueName: 'Большой бассейн', date: '2025-03-15', timeStart: '12:00', timeEnd: '13:00', duration: 60, status: 'published', sold: 28, capacity: 30, pricingTemplate: 3 },
    { id: 4, name: 'Свободное плавание 14:00', type: 'session', venue: 1, venueName: 'Большой бассейн', date: '2025-03-15', timeStart: '14:00', timeEnd: '15:30', duration: 90, status: 'published', sold: 95, capacity: 120, pricingTemplate: 1 },
    { id: 5, name: 'Свободное плавание 08:00', type: 'session', venue: 1, venueName: 'Большой бассейн', date: '2025-03-16', timeStart: '08:00', timeEnd: '09:30', duration: 90, status: 'published', sold: 72, capacity: 120, pricingTemplate: 1 },
    { id: 6, name: 'Детское плавание 10:00', type: 'session', venue: 3, venueName: 'Детская зона', date: '2025-03-16', timeStart: '10:00', timeEnd: '11:00', duration: 60, status: 'published', sold: 40, capacity: 50, pricingTemplate: 4 },
    { id: 7, name: 'Водное поло (тренировка)', type: 'standard', venue: 2, venueName: 'Открытый бассейн', date: '2025-03-18', timeStart: '18:00', timeEnd: '20:00', duration: 120, status: 'draft', sold: 12, capacity: 24, pricingTemplate: 5 },
    { id: 8, name: 'Аквааэробика 12:00', type: 'standard', venue: 1, venueName: 'Большой бассейн', date: '2025-03-17', timeStart: '12:00', timeEnd: '13:00', duration: 60, status: 'published', sold: 25, capacity: 30, pricingTemplate: 3 },
    { id: 9, name: 'Открытый бассейн 10:00', type: 'session', venue: 2, venueName: 'Открытый бассейн', date: '2025-03-20', timeStart: '10:00', timeEnd: '12:00', duration: 120, status: 'paused', sold: 0, capacity: 80, pricingTemplate: 2 },
  ],
  pricingTemplates: [
    { id: 1, name: 'Бассейн будни', status: 'active', eventsCount: 8 },
    { id: 2, name: 'Открытый бассейн', status: 'active', eventsCount: 4 },
    { id: 3, name: 'Аквааэробика', status: 'active', eventsCount: 6 },
    { id: 4, name: 'Детское плавание', status: 'active', eventsCount: 3 },
    { id: 5, name: 'Водное поло', status: 'active', eventsCount: 2 },
    { id: 6, name: 'Летний сезон 2024', status: 'archived', eventsCount: 0 },
  ],
  tariffs: [
    { id: 1, name: 'Стандартный', slug: 'standard', description: 'Разовое посещение', color: '#2080f0', sortOrder: 1, templatesCount: 6 },
    { id: 2, name: 'Абонемент', slug: 'subscription', description: 'Безлимитное посещение (месяц)', color: '#18a058', sortOrder: 2, templatesCount: 4 },
    { id: 3, name: 'Льготный', slug: 'discount', description: 'Пенсионеры, инвалиды', color: '#f0a020', sortOrder: 3, templatesCount: 5 },
  ],
  ticketTypes: [
    { id: 1, name: 'Взрослый', slug: 'adult', channel: 'Все', description: 'от 14 лет', sortOrder: 1, templatesCount: 6 },
    { id: 2, name: 'Детский', slug: 'child', channel: 'Все', description: 'от 3 до 13 лет', sortOrder: 2, templatesCount: 6 },
    { id: 3, name: 'Семейный', slug: 'family', channel: 'Все', description: '2 взрослых + 2 детских', sortOrder: 3, templatesCount: 3 },
  ],
  services: [
    { id: 1, name: 'Прокат полотенец', slug: 'towel', category: 'Прокат', icon: '🏖️', description: 'Полотенце на время посещения', templatesCount: 6 },
    { id: 2, name: 'Шкафчик', slug: 'locker', category: 'Сервис', icon: '🔐', description: 'Персональный шкафчик в раздевалке', templatesCount: 6 },
    { id: 3, name: 'Тренер по плаванию', slug: 'coach', category: 'Обучение', icon: '🏊', description: 'Индивидуальное занятие с тренером', templatesCount: 2 },
    { id: 4, name: 'Фен / сушка', slug: 'dryer', category: 'Сервис', icon: '💨', description: 'Использование фена в раздевалке', templatesCount: 0 },
    { id: 5, name: 'Водная горка (допуск)', slug: 'waterslide', category: 'Другое', icon: '🎢', description: 'Доступ к горкам и аттракционам', templatesCount: 3 },
  ],
  templatePrices: {
    1: {
      tickets: {
        1: { 1: 800, 2: 500, 3: 2200 },
        2: { 1: 600, 2: 400 },
        3: { 1: 550, 2: 350 },
      },
      services: {
        1: { 1: { 1: 200, 2: 150 }, 2: { 1: 150, 2: 100 }, 3: { 1: 150, 2: 100 } },
        2: { 1: { 1: 300, 2: 200 }, 2: { 1: 0, 2: 0 }, 3: { 1: 250, 2: 150 } }
      }
    }
  },
  orders: [
    { id: 20001, date: '2024-12-15T08:15:00', customer: { name: 'Павел Егоров', phone: '+7 (916) 100-20-30', email: 'egorov.p@mail.ru', segment: 'Постоянный клиент', ordersTotal: 20 }, event: 'Свободное плавание 08:00', eventType: 'session', ticketsCount: 2, servicesCount: 2, total: 2200, discount: 0, promoCode: null, status: 'paid', channel: 'Сайт', paymentMethod: 'Карта **** 3344' },
    { id: 20002, date: '2024-12-15T09:30:00', customer: { name: 'Наталья Фёдорова', phone: '+7 (903) 200-30-40', email: 'natalia.f@gmail.com', segment: 'Новый', ordersTotal: 1 }, event: 'Аквааэробика 12:00', eventType: 'standard', ticketsCount: 1, servicesCount: 1, total: 1200, discount: 0, promoCode: null, status: 'paid', channel: 'Сайт', paymentMethod: 'СБП' },
    { id: 20003, date: '2024-12-16T07:50:00', customer: { name: 'Роман Тихонов', phone: '+7 (926) 300-40-50', email: 'roman.t@yandex.ru', segment: 'Абонемент', ordersTotal: 15 }, event: 'Свободное плавание 10:00', eventType: 'session', ticketsCount: 1, servicesCount: 0, total: 0, discount: 0, promoCode: null, status: 'paid', channel: 'Мобильное приложение', paymentMethod: 'Абонемент' },
    { id: 20004, date: '2024-12-16T10:00:00', customer: { name: 'Светлана Жукова', phone: '+7 (977) 400-50-60', email: 'zhukova.s@mail.ru', segment: 'Постоянный клиент', ordersTotal: 9 }, event: 'Детское плавание 10:00', eventType: 'session', ticketsCount: 3, servicesCount: 2, total: 2100, discount: 210, promoCode: 'AQUA10', status: 'paid', channel: 'Сайт', paymentMethod: 'Карта **** 7788' },
    { id: 20005, date: '2024-12-17T14:00:00', customer: { name: 'Игорь Самойлов', phone: '+7 (905) 500-60-70', email: 'igor.s@inbox.ru', segment: 'Новый', ordersTotal: 1 }, event: 'Свободное плавание 14:00', eventType: 'session', ticketsCount: 2, servicesCount: 1, total: 1900, discount: 0, promoCode: null, status: 'created', channel: 'Касса', paymentMethod: null },
    { id: 20006, date: '2024-12-17T16:00:00', customer: { name: 'Анастасия Орлова', phone: '+7 (968) 600-70-80', email: 'orlova.a@gmail.com', segment: 'VIP', ordersTotal: 22 }, event: 'Свободное плавание 10:00', eventType: 'session', ticketsCount: 1, servicesCount: 0, total: 800, discount: 0, promoCode: null, status: 'refunded', channel: 'Сайт', paymentMethod: 'Карта **** 1122' },
  ],
  tickets: [
    { id: 'TKT-020001', orderId: 20001, event: 'Свободное плавание 08:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 800, customer: 'Павел Егоров', status: 'used', entry: '08:05', exit: '09:25', sector: null, row: null, seat: null },
    { id: 'TKT-020002', orderId: 20001, event: 'Свободное плавание 08:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Детский', price: 500, customer: 'Павел Егоров', status: 'used', entry: '08:05', exit: '09:25', sector: null, row: null, seat: null },
    { id: 'TKT-020003', orderId: 20002, event: 'Аквааэробика 12:00', eventType: 'standard', tariff: 'Стандартный', ticketType: 'Взрослый', price: 1000, customer: 'Наталья Фёдорова', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-020004', orderId: 20003, event: 'Свободное плавание 10:00', eventType: 'session', tariff: 'Абонемент', ticketType: 'Взрослый', price: 0, customer: 'Роман Тихонов', status: 'used', entry: '10:02', exit: '11:20', sector: null, row: null, seat: null },
    { id: 'TKT-020005', orderId: 20004, event: 'Детское плавание 10:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 600, customer: 'Светлана Жукова', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-020006', orderId: 20004, event: 'Детское плавание 10:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Детский', price: 400, customer: 'Светлана Жукова', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-020007', orderId: 20004, event: 'Детское плавание 10:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Детский', price: 400, customer: 'Светлана Жукова', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-020008', orderId: 20005, event: 'Свободное плавание 14:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 800, customer: 'Игорь Самойлов', status: 'active', entry: null, exit: null, sector: null, row: null, seat: null },
    { id: 'TKT-020009', orderId: 20006, event: 'Свободное плавание 10:00', eventType: 'session', tariff: 'Стандартный', ticketType: 'Взрослый', price: 800, customer: 'Анастасия Орлова', status: 'refunded', entry: null, exit: null, sector: null, row: null, seat: null },
  ],
  guests: [
    { id: 1, name: 'Павел Егоров', phone: '+7 (916) 100-20-30', email: 'egorov.p@mail.ru', segment: 'Постоянный клиент', ordersCount: 20, totalSpent: 42000, lastVisit: '2024-12-20', registeredAt: '2024-01-10' },
    { id: 2, name: 'Наталья Фёдорова', phone: '+7 (903) 200-30-40', email: 'natalia.f@gmail.com', segment: 'Новый', ordersCount: 1, totalSpent: 1200, lastVisit: '2024-12-15', registeredAt: '2024-12-15' },
    { id: 3, name: 'Роман Тихонов', phone: '+7 (926) 300-40-50', email: 'roman.t@yandex.ru', segment: 'Абонемент', ordersCount: 15, totalSpent: 0, lastVisit: '2024-12-16', registeredAt: '2024-03-01' },
    { id: 4, name: 'Светлана Жукова', phone: '+7 (977) 400-50-60', email: 'zhukova.s@mail.ru', segment: 'Постоянный клиент', ordersCount: 9, totalSpent: 21000, lastVisit: '2024-12-16', registeredAt: '2024-02-15' },
    { id: 5, name: 'Игорь Самойлов', phone: '+7 (905) 500-60-70', email: 'igor.s@inbox.ru', segment: 'Новый', ordersCount: 1, totalSpent: 1900, lastVisit: null, registeredAt: '2024-12-17' },
    { id: 6, name: 'Анастасия Орлова', phone: '+7 (968) 600-70-80', email: 'orlova.a@gmail.com', segment: 'VIP', ordersCount: 22, totalSpent: 85000, lastVisit: '2024-12-17', registeredAt: '2023-06-01' },
  ],
  accessLog: [
    { id: 1, ticketId: 'TKT-020001', guest: 'Павел Егоров', event: 'Свободное плавание 08:00', zone: 'Вход 1', direction: 'in', time: '2024-12-20T08:05:00', device: 'Турникет №1', operator: 'Система' },
    { id: 2, ticketId: 'TKT-020001', guest: 'Павел Егоров', event: 'Свободное плавание 08:00', zone: 'Вход 1', direction: 'out', time: '2024-12-20T09:25:00', device: 'Турникет №1', operator: 'Система' },
    { id: 3, ticketId: 'TKT-020004', guest: 'Роман Тихонов', event: 'Свободное плавание 10:00', zone: 'Вход 1', direction: 'in', time: '2024-12-16T10:02:00', device: 'Турникет №2', operator: 'Система' },
  ],
  dashboardMetrics: {
    today: { revenue: 312000, revenueDelta: 5, ticketsSold: 218, ticketsSoldDelta: 3, avgCheck: 1432, avgCheckDelta: 1, occupancy: 65, occupancyDelta: 4, eventsToday: 6, activeOrders: 34, refundsToday: 1, passesToday: 195 },
    revenueChart: [
      { date: '03.01', value: 210000 }, { date: '03.02', value: 195000 }, { date: '03.03', value: 280000 },
      { date: '03.04', value: 260000 }, { date: '03.05', value: 190000 }, { date: '03.06', value: 340000 },
      { date: '03.07', value: 410000 }, { date: '03.08', value: 230000 }, { date: '03.09', value: 260000 },
      { date: '03.10', value: 300000 }, { date: '03.11', value: 250000 }, { date: '03.12', value: 320000 },
      { date: '03.13', value: 350000 }, { date: '03.14', value: 420000 }, { date: '03.15', value: 312000 },
    ],
    topEvents: [
      { name: 'Свободное плавание 10:00', date: '15.03', sold: 110, capacity: 120, revenue: 88000 },
      { name: 'Свободное плавание 14:00', date: '15.03', sold: 95, capacity: 120, revenue: 76000 },
      { name: 'Свободное плавание 08:00', date: '15.03', sold: 85, capacity: 120, revenue: 68000 },
      { name: 'Аквааэробика 12:00', date: '15.03', sold: 28, capacity: 30, revenue: 28000 },
    ]
  },
  priceCategories: [
    { id: 1, venueId: 1, name: 'Основная зона', color: '#2080f0', basePrice: 800, sectorsCount: 1, seatsCount: null, sortOrder: 1 },
    { id: 2, venueId: 1, name: 'Детская зона', color: '#18a058', basePrice: 500, sectorsCount: 1, seatsCount: null, sortOrder: 2 },
    { id: 3, venueId: 2, name: 'Открытый бассейн', color: '#f0a020', basePrice: 600, sectorsCount: 1, seatsCount: null, sortOrder: 3 },
  ],
  venueZones: [
    { id: 1, venueId: 1, name: 'Дорожки 1–6', capacity: 120, priceCategoryName: 'Стандарт', status: 'active' },
    { id: 2, venueId: 1, name: 'Детская чаша', capacity: 50, priceCategoryName: 'Детский', status: 'active' },
    { id: 3, venueId: 2, name: 'Открытый бассейн', capacity: 80, priceCategoryName: 'Стандарт', status: 'active' },
  ],
  rentalItems: [
    { id: 1, ticketId: 'TKT-020001', guest: 'Павел Егоров', item: 'Полотенце (большое)', issuedAt: '2024-12-20T08:07:00', returnedAt: '2024-12-20T09:20:00', status: 'returned' },
    { id: 2, ticketId: 'TKT-020002', guest: 'Павел Егоров', item: 'Полотенце (детское)', issuedAt: '2024-12-20T08:07:00', returnedAt: '2024-12-20T09:20:00', status: 'returned' },
    { id: 3, ticketId: 'TKT-020005', guest: 'Светлана Жукова', item: 'Шкафчик №42', issuedAt: '2024-12-16T10:05:00', returnedAt: null, status: 'pending' },
  ],
  promoCodes: [
    { id: 1, code: 'AQUA10', type: 'percent', value: 10, usageLimit: 300, usageCount: 87, status: 'active', startDate: '2024-11-01', endDate: '2025-05-31' },
    { id: 2, code: 'SWIM500', type: 'fixed', value: 500, usageLimit: 200, usageCount: 45, status: 'active', startDate: '2024-12-01', endDate: '2025-03-31' },
    { id: 3, code: 'KIDSFREE', type: 'percent', value: 100, usageLimit: 50, usageCount: 12, status: 'active', startDate: '2025-01-01', endDate: '2025-06-30' },
    { id: 4, code: 'SUMMER24', type: 'percent', value: 20, usageLimit: 500, usageCount: 500, status: 'expired', startDate: '2024-06-01', endDate: '2024-09-30' },
  ],
  orderServices: [
    { id: 1, orderId: 20001, ticketId: 'TKT-020001', service: 'Прокат полотенец', icon: '🏖️', qty: 1, unitPrice: 200, total: 200 },
    { id: 2, orderId: 20001, ticketId: 'TKT-020002', service: 'Прокат полотенец', icon: '🏖️', qty: 1, unitPrice: 150, total: 150 },
    { id: 3, orderId: 20002, ticketId: 'TKT-020003', service: 'Шкафчик', icon: '🔐', qty: 1, unitPrice: 300, total: 300 },
    { id: 4, orderId: 20004, ticketId: 'TKT-020005', service: 'Шкафчик', icon: '🔐', qty: 1, unitPrice: 300, total: 300 },
    { id: 5, orderId: 20004, ticketId: 'TKT-020006', service: 'Водная горка (допуск)', icon: '🎢', qty: 1, unitPrice: 400, total: 400 },
    { id: 6, orderId: 20005, ticketId: 'TKT-020008', service: 'Прокат полотенец', icon: '🏖️', qty: 1, unitPrice: 200, total: 200 },
  ],
  addonOrders: [
    { id: 20010, parentOrderId: 20001, ticketId: 'TKT-020001', date: '2024-12-20T08:30:00', service: 'Шкафчик', icon: '🔐', qty: 1, unitPrice: 300, total: 300, status: 'paid', channel: 'Касса' },
    { id: 20011, parentOrderId: 20004, ticketId: 'TKT-020006', date: '2024-12-16T10:20:00', service: 'Тренер по плаванию', icon: '🏊', qty: 1, unitPrice: 2000, total: 2000, status: 'paid', channel: 'Касса' },
  ],
  segments: [
    { id: 1, name: 'VIP', color: '#d03050', description: 'Премиальные гости с высоким LTV', rules: 'Потрачено > 30 000 ₽ и визитов > 15', guestsCount: 1, totalRevenue: 85000, avgCheck: 3864, isAuto: true },
    { id: 2, name: 'Постоянный клиент', color: '#18a058', description: 'Регулярные посетители бассейна', rules: 'Визитов > 5 или потрачено > 10 000 ₽', guestsCount: 2, totalRevenue: 63000, avgCheck: 2172, isAuto: true },
    { id: 3, name: 'Новый', color: '#2080f0', description: 'Недавно зарегистрированные гости', rules: 'Визитов ≤ 2 и зарегистрирован < 30 дней назад', guestsCount: 2, totalRevenue: 3100, avgCheck: 1550, isAuto: true },
    { id: 4, name: 'Абонемент', color: '#8b5cf6', description: 'Владельцы активных абонементов', rules: 'Есть активный абонемент', guestsCount: 1, totalRevenue: 0, avgCheck: 0, isAuto: true },
  ],
  teamMembers: [
    { id: 1, name: 'Александр Иванов', email: 'admin@fanzilla.ru', role: 'Владелец', status: 'active', lastActive: '2025-03-15T10:30:00' },
    { id: 2, name: 'Олег Васильев', email: 'oleg@aqua-luzhniki.ru', role: 'Администратор', status: 'active', lastActive: '2025-03-15T08:00:00' },
    { id: 3, name: 'Ирина Смирнова', email: 'irina@aqua-luzhniki.ru', role: 'Менеджер', status: 'active', lastActive: '2025-03-14T17:30:00' },
    { id: 4, name: 'Алёна Попова', email: 'alena@aqua-luzhniki.ru', role: 'Кассир', status: 'active', lastActive: '2025-03-15T07:55:00' },
  ],
}

// ============================================================
// WORKSPACE 3: Центральный стадион Лужники
// ============================================================
const ws3 = {
  venues: [
    { id: 1, name: 'Большая спортивная арена', type: 'stadium', address: 'Лужнецкая наб., 24, Москва', city: 'Москва', status: 'active', capacity: 81000, sectors: 48, events: 24, yandexMaps: 'https://yandex.ru/maps/org/3001' },
    { id: 2, name: 'Малая спортивная арена', type: 'stadium', address: 'Лужнецкая наб., 24, стр. 2, Москва', city: 'Москва', status: 'active', capacity: 8700, sectors: 12, events: 8, yandexMaps: 'https://yandex.ru/maps/org/3002' },
  ],
  events: [
    { id: 1, name: 'Спартак — ЦСКА', type: 'match', venue: 1, venueName: 'Большая спортивная арена', date: '2025-03-18', timeStart: '19:00', timeEnd: null, duration: null, status: 'published', sold: 52000, capacity: 72000, pricingTemplate: 1, tournament: 'РПЛ', stage: 'Тур 22', teamHome: 'Спартак', teamAway: 'ЦСКА' },
    { id: 2, name: 'Зенит — Динамо', type: 'match', venue: 1, venueName: 'Большая спортивная арена', date: '2025-03-22', timeStart: '16:30', timeEnd: null, duration: null, status: 'published', sold: 38000, capacity: 72000, pricingTemplate: 1, tournament: 'РПЛ', stage: 'Тур 23', teamHome: 'Зенит', teamAway: 'Динамо' },
    { id: 3, name: 'Концерт: Би-2', type: 'standard', venue: 1, venueName: 'Большая спортивная арена', date: '2025-03-25', timeStart: '20:00', timeEnd: '23:00', duration: null, status: 'published', sold: 45000, capacity: 65000, pricingTemplate: 3 },
    { id: 4, name: 'Россия — Бразилия (товарищеский)', type: 'match', venue: 1, venueName: 'Большая спортивная арена', date: '2025-03-28', timeStart: '20:00', timeEnd: null, duration: null, status: 'draft', sold: 0, capacity: 72000, pricingTemplate: 2, tournament: 'Товарищеский матч', stage: '', teamHome: 'Россия', teamAway: 'Бразилия' },
    { id: 5, name: 'Мини-футбол: финал кубка', type: 'match', venue: 2, venueName: 'Малая спортивная арена', date: '2025-03-20', timeStart: '18:00', timeEnd: null, duration: null, status: 'published', sold: 6200, capacity: 8000, pricingTemplate: 4 },
    { id: 6, name: 'Концерт: ДДТ', type: 'standard', venue: 1, venueName: 'Большая спортивная арена', date: '2025-04-05', timeStart: '19:00', timeEnd: '22:30', duration: null, status: 'draft', sold: 0, capacity: 65000, pricingTemplate: 3 },
    { id: 7, name: 'Локомотив — Краснодар', type: 'match', venue: 1, venueName: 'Большая спортивная арена', date: '2025-03-15', timeStart: '14:00', timeEnd: null, duration: null, status: 'completed', sold: 42000, capacity: 72000, pricingTemplate: 1, tournament: 'РПЛ', stage: 'Тур 21', teamHome: 'Локомотив', teamAway: 'Краснодар' },
  ],
  pricingTemplates: [
    { id: 1, name: 'РПЛ стандарт', status: 'active', eventsCount: 12 },
    { id: 2, name: 'Сборная / Международные', status: 'active', eventsCount: 3 },
    { id: 3, name: 'Концерт', status: 'active', eventsCount: 5 },
    { id: 4, name: 'Малая арена', status: 'active', eventsCount: 4 },
    { id: 5, name: 'Новогодний концерт', status: 'archived', eventsCount: 0 },
  ],
  tariffs: [
    { id: 1, name: 'Стандартный', slug: 'standard', description: 'Обычное место', color: '#2080f0', sortOrder: 1, templatesCount: 5 },
    { id: 2, name: 'VIP', slug: 'vip', description: 'VIP-ложа с обслуживанием', color: '#d03050', sortOrder: 2, templatesCount: 4 },
    { id: 3, name: 'Льготный', slug: 'discount', description: 'Студенты, пенсионеры, инвалиды', color: '#f0a020', sortOrder: 3, templatesCount: 5 },
  ],
  ticketTypes: [
    { id: 1, name: 'Взрослый', slug: 'adult', channel: 'Все', description: 'от 16 лет', sortOrder: 1, templatesCount: 5 },
    { id: 2, name: 'Детский', slug: 'child', channel: 'Все', description: 'от 7 до 15 лет', sortOrder: 2, templatesCount: 5 },
  ],
  services: [
    { id: 1, name: 'Парковка', slug: 'parking', category: 'Сервис', icon: '🅿️', description: 'Парковочный талон P1–P5', templatesCount: 5 },
    { id: 2, name: 'VIP-ложа', slug: 'vip-box', category: 'Другое', icon: '🏟️', description: 'Ложа на 12 персон с обслуживанием', templatesCount: 2 },
    { id: 3, name: 'Fan ID', slug: 'fan-id', category: 'Сервис', icon: '🪪', description: 'Оформление Fan ID на мероприятие', templatesCount: 0 },
    { id: 4, name: 'Аренда бинокля', slug: 'binoculars', category: 'Прокат', icon: '🔭', description: 'Бинокль на время матча', templatesCount: 3 },
  ],
  templatePrices: {
    1: {
      tickets: {
        1: { 1: 2500, 2: 1500 },
        2: { 1: 15000, 2: 10000 },
        3: { 1: 1500, 2: 800 },
      },
      services: {
        1: { 1: { 1: 500 }, 2: { 1: 0 }, 3: { 1: 300 } },
        4: { 1: { 1: 200 }, 2: { 1: 0 }, 3: { 1: 150 } }
      }
    }
  },
  orders: [
    { id: 30001, date: '2024-12-10T11:00:00', customer: { name: 'Максим Лебедев', phone: '+7 (916) 700-80-90', email: 'lebedev.m@mail.ru', segment: 'Постоянный клиент', ordersTotal: 18 }, event: 'Спартак — ЦСКА', eventType: 'match', ticketsCount: 4, servicesCount: 1, total: 11000, discount: 0, promoCode: null, status: 'paid', channel: 'Сайт', paymentMethod: 'Карта **** 9988' },
    { id: 30002, date: '2024-12-10T12:30:00', customer: { name: 'Юлия Андреева', phone: '+7 (903) 800-90-01', email: 'julia.a@gmail.com', segment: 'VIP', ordersTotal: 42 }, event: 'Спартак — ЦСКА', eventType: 'match', ticketsCount: 12, servicesCount: 2, total: 195000, discount: 0, promoCode: null, status: 'paid', channel: 'Партнёр', paymentMethod: 'Безналичный' },
    { id: 30003, date: '2024-12-12T09:00:00', customer: { name: 'Константин Ильин', phone: '+7 (926) 900-01-12', email: 'k.ilyin@yandex.ru', segment: 'Новый', ordersTotal: 1 }, event: 'Концерт: Би-2', eventType: 'standard', ticketsCount: 2, servicesCount: 0, total: 6000, discount: 600, promoCode: 'CONCERT10', status: 'paid', channel: 'Сайт', paymentMethod: 'Карта **** 4455' },
    { id: 30004, date: '2024-12-14T15:00:00', customer: { name: 'Виктория Зайцева', phone: '+7 (977) 012-23-34', email: 'v.zaitseva@mail.ru', segment: 'Постоянный клиент', ordersTotal: 7 }, event: 'Зенит — Динамо', eventType: 'match', ticketsCount: 2, servicesCount: 1, total: 5500, discount: 0, promoCode: null, status: 'paid', channel: 'Мобильное приложение', paymentMethod: 'Карта **** 6677' },
    { id: 30005, date: '2024-12-15T10:00:00', customer: { name: 'Артём Николаев', phone: '+7 (905) 123-34-45', email: 'artem.n@inbox.ru', segment: 'Корпоративный', ordersTotal: 3 }, event: 'Спартак — ЦСКА', eventType: 'match', ticketsCount: 20, servicesCount: 4, total: 55000, discount: 5500, promoCode: 'CORP10', status: 'paid', channel: 'Партнёр', paymentMethod: 'Безналичный' },
    { id: 30006, date: '2024-12-16T18:00:00', customer: { name: 'Дарья Миронова', phone: '+7 (968) 234-45-56', email: 'daria.m@gmail.com', segment: 'Новый', ordersTotal: 1 }, event: 'Россия — Бразилия (товарищеский)', eventType: 'match', ticketsCount: 2, servicesCount: 0, total: 5000, discount: 0, promoCode: null, status: 'created', channel: 'Сайт', paymentMethod: null },
    { id: 30007, date: '2024-12-17T14:00:00', customer: { name: 'Евгений Попов', phone: '+7 (916) 345-56-67', email: 'e.popov@ya.ru', segment: 'Постоянный клиент', ordersTotal: 11 }, event: 'Локомотив — Краснодар', eventType: 'match', ticketsCount: 3, servicesCount: 1, total: 8200, discount: 0, promoCode: null, status: 'refunded', channel: 'Касса', paymentMethod: 'Наличные' },
  ],
  tickets: [
    { id: 'TKT-030001', orderId: 30001, event: 'Спартак — ЦСКА', eventType: 'match', tariff: 'Стандартный', ticketType: 'Взрослый', price: 2500, customer: 'Максим Лебедев', status: 'active', entry: null, exit: null, sector: 'B12', row: 15, seat: 8 },
    { id: 'TKT-030002', orderId: 30001, event: 'Спартак — ЦСКА', eventType: 'match', tariff: 'Стандартный', ticketType: 'Взрослый', price: 2500, customer: 'Максим Лебедев', status: 'active', entry: null, exit: null, sector: 'B12', row: 15, seat: 9 },
    { id: 'TKT-030003', orderId: 30001, event: 'Спартак — ЦСКА', eventType: 'match', tariff: 'Стандартный', ticketType: 'Детский', price: 1500, customer: 'Максим Лебедев', status: 'active', entry: null, exit: null, sector: 'B12', row: 15, seat: 10 },
    { id: 'TKT-030004', orderId: 30002, event: 'Спартак — ЦСКА', eventType: 'match', tariff: 'VIP', ticketType: 'Взрослый', price: 15000, customer: 'Юлия Андреева', status: 'active', entry: null, exit: null, sector: 'VIP-1', row: 1, seat: 1 },
    { id: 'TKT-030005', orderId: 30003, event: 'Концерт: Би-2', eventType: 'standard', tariff: 'Стандартный', ticketType: 'Взрослый', price: 3000, customer: 'Константин Ильин', status: 'active', entry: null, exit: null, sector: 'C5', row: 22, seat: 14 },
    { id: 'TKT-030006', orderId: 30004, event: 'Зенит — Динамо', eventType: 'match', tariff: 'Стандартный', ticketType: 'Взрослый', price: 2500, customer: 'Виктория Зайцева', status: 'active', entry: null, exit: null, sector: 'A3', row: 8, seat: 22 },
    { id: 'TKT-030007', orderId: 30004, event: 'Зенит — Динамо', eventType: 'match', tariff: 'Стандартный', ticketType: 'Детский', price: 1500, customer: 'Виктория Зайцева', status: 'active', entry: null, exit: null, sector: 'A3', row: 8, seat: 23 },
    { id: 'TKT-030008', orderId: 30007, event: 'Локомотив — Краснодар', eventType: 'match', tariff: 'Стандартный', ticketType: 'Взрослый', price: 2500, customer: 'Евгений Попов', status: 'refunded', entry: null, exit: null, sector: 'D8', row: 20, seat: 5 },
  ],
  guests: [
    { id: 1, name: 'Максим Лебедев', phone: '+7 (916) 700-80-90', email: 'lebedev.m@mail.ru', segment: 'Постоянный клиент', ordersCount: 18, totalSpent: 185000, lastVisit: '2024-12-18', registeredAt: '2023-08-01' },
    { id: 2, name: 'Юлия Андреева', phone: '+7 (903) 800-90-01', email: 'julia.a@gmail.com', segment: 'VIP', ordersCount: 42, totalSpent: 1250000, lastVisit: '2024-12-18', registeredAt: '2022-05-15' },
    { id: 3, name: 'Константин Ильин', phone: '+7 (926) 900-01-12', email: 'k.ilyin@yandex.ru', segment: 'Новый', ordersCount: 1, totalSpent: 6000, lastVisit: null, registeredAt: '2024-12-12' },
    { id: 4, name: 'Виктория Зайцева', phone: '+7 (977) 012-23-34', email: 'v.zaitseva@mail.ru', segment: 'Постоянный клиент', ordersCount: 7, totalSpent: 32000, lastVisit: '2024-12-22', registeredAt: '2024-03-10' },
    { id: 5, name: 'Артём Николаев', phone: '+7 (905) 123-34-45', email: 'artem.n@inbox.ru', segment: 'Корпоративный', ordersCount: 3, totalSpent: 155000, lastVisit: '2024-12-15', registeredAt: '2024-06-01' },
    { id: 6, name: 'Дарья Миронова', phone: '+7 (968) 234-45-56', email: 'daria.m@gmail.com', segment: 'Новый', ordersCount: 1, totalSpent: 5000, lastVisit: null, registeredAt: '2024-12-16' },
    { id: 7, name: 'Евгений Попов', phone: '+7 (916) 345-56-67', email: 'e.popov@ya.ru', segment: 'Постоянный клиент', ordersCount: 11, totalSpent: 75000, lastVisit: '2024-12-17', registeredAt: '2023-10-01' },
  ],
  accessLog: [
    { id: 1, ticketId: 'TKT-030008', guest: 'Евгений Попов', event: 'Локомотив — Краснодар', zone: 'Вход D', direction: 'in', time: '2025-03-15T13:45:00', device: 'Турникет D-3', operator: 'Система' },
    { id: 2, ticketId: 'TKT-030008', guest: 'Евгений Попов', event: 'Локомотив — Краснодар', zone: 'Вход D', direction: 'out', time: '2025-03-15T16:10:00', device: 'Турникет D-1', operator: 'Система' },
  ],
  dashboardMetrics: {
    today: { revenue: 8540000, revenueDelta: 22, ticketsSold: 4120, ticketsSoldDelta: 15, avgCheck: 2073, avgCheckDelta: 5, occupancy: 72, occupancyDelta: 8, eventsToday: 2, activeOrders: 312, refundsToday: 8, passesToday: 3850 },
    revenueChart: [
      { date: '03.01', value: 2100000 }, { date: '03.02', value: 1800000 }, { date: '03.03', value: 3200000 },
      { date: '03.04', value: 2800000 }, { date: '03.05', value: 1500000 }, { date: '03.06', value: 4200000 },
      { date: '03.07', value: 5100000 }, { date: '03.08', value: 2400000 }, { date: '03.09', value: 2600000 },
      { date: '03.10', value: 3500000 }, { date: '03.11', value: 2900000 }, { date: '03.12', value: 4800000 },
      { date: '03.13', value: 6200000 }, { date: '03.14', value: 7400000 }, { date: '03.15', value: 8540000 },
    ],
    topEvents: [
      { name: 'Спартак — ЦСКА', date: '18.03', sold: 52000, capacity: 72000, revenue: 156000000 },
      { name: 'Концерт: Би-2', date: '25.03', sold: 45000, capacity: 65000, revenue: 135000000 },
      { name: 'Локомотив — Краснодар', date: '15.03', sold: 42000, capacity: 72000, revenue: 105000000 },
      { name: 'Зенит — Динамо', date: '22.03', sold: 38000, capacity: 72000, revenue: 95000000 },
    ]
  },
  priceCategories: [
    { id: 1, venueId: 1, name: 'VIP-ложи', color: '#d03050', basePrice: 15000, sectorsCount: 4, seatsCount: 1200, sortOrder: 1 },
    { id: 2, venueId: 1, name: 'Категория A', color: '#f0a020', basePrice: 5000, sectorsCount: 8, seatsCount: 12000, sortOrder: 2 },
    { id: 3, venueId: 1, name: 'Категория B', color: '#18a058', basePrice: 2500, sectorsCount: 16, seatsCount: 28000, sortOrder: 3 },
    { id: 4, venueId: 1, name: 'Категория C', color: '#2080f0', basePrice: 1500, sectorsCount: 12, seatsCount: 20000, sortOrder: 4 },
    { id: 5, venueId: 1, name: 'Фан-зона', color: '#909399', basePrice: 800, sectorsCount: 8, seatsCount: null, sortOrder: 5 },
    { id: 6, venueId: 2, name: 'Трибуна', color: '#2080f0', basePrice: 1200, sectorsCount: 6, seatsCount: 5000, sortOrder: 1 },
    { id: 7, venueId: 2, name: 'VIP', color: '#d03050', basePrice: 5000, sectorsCount: 2, seatsCount: 800, sortOrder: 2 },
  ],
  venueZones: [
    { id: 1, venueId: 1, name: 'Северная трибуна', capacity: 20000, priceCategoryName: 'Категория B', status: 'active' },
    { id: 2, venueId: 1, name: 'Южная трибуна', capacity: 20000, priceCategoryName: 'Категория B', status: 'active' },
    { id: 3, venueId: 1, name: 'Западная трибуна', capacity: 18000, priceCategoryName: 'Категория A', status: 'active' },
    { id: 4, venueId: 1, name: 'Восточная трибуна', capacity: 18000, priceCategoryName: 'Категория A', status: 'active' },
  ],
  rentalItems: [
    { id: 1, ticketId: 'TKT-030004', guest: 'Юлия Андреева', item: 'Бинокль', issuedAt: null, returnedAt: null, status: 'pending' },
  ],
  promoCodes: [
    { id: 1, code: 'CONCERT10', type: 'percent', value: 10, usageLimit: 1000, usageCount: 340, status: 'active', startDate: '2024-10-01', endDate: '2025-06-30' },
    { id: 2, code: 'CORP10', type: 'percent', value: 10, usageLimit: 200, usageCount: 45, status: 'active', startDate: '2024-01-01', endDate: '2025-12-31' },
    { id: 3, code: 'FANZONE', type: 'fixed', value: 200, usageLimit: 5000, usageCount: 1230, status: 'active', startDate: '2024-08-01', endDate: '2025-07-31' },
    { id: 4, code: 'WORLDCUP', type: 'percent', value: 15, usageLimit: 10000, usageCount: 10000, status: 'expired', startDate: '2024-06-01', endDate: '2024-07-31' },
  ],
  orderServices: [
    { id: 1, orderId: 30001, ticketId: 'TKT-030001', service: 'Парковка', icon: '🅿️', qty: 1, unitPrice: 500, total: 500 },
    { id: 2, orderId: 30002, ticketId: 'TKT-030004', service: 'VIP-ложа', icon: '🏟️', qty: 1, unitPrice: 150000, total: 150000 },
    { id: 3, orderId: 30002, ticketId: 'TKT-030004', service: 'Парковка', icon: '🅿️', qty: 2, unitPrice: 500, total: 1000 },
    { id: 4, orderId: 30004, ticketId: 'TKT-030006', service: 'Парковка', icon: '🅿️', qty: 1, unitPrice: 500, total: 500 },
    { id: 5, orderId: 30005, ticketId: 'TKT-030001', service: 'Парковка', icon: '🅿️', qty: 4, unitPrice: 500, total: 2000 },
    { id: 6, orderId: 30007, ticketId: 'TKT-030008', service: 'Аренда бинокля', icon: '🔭', qty: 1, unitPrice: 200, total: 200 },
  ],
  addonOrders: [
    { id: 30010, parentOrderId: 30001, ticketId: 'TKT-030002', date: '2025-03-18T18:45:00', service: 'Аренда бинокля', icon: '🔭', qty: 1, unitPrice: 200, total: 200, status: 'paid', channel: 'Касса' },
  ],
  segments: [
    { id: 1, name: 'VIP', color: '#d03050', description: 'VIP-гости, ложи и премиальные места', rules: 'Потрачено > 100 000 ₽ или заказывал VIP-ложу', guestsCount: 1, totalRevenue: 1250000, avgCheck: 29762, isAuto: true },
    { id: 2, name: 'Постоянный клиент', color: '#18a058', description: 'Постоянные болельщики и зрители', rules: 'Визитов > 5 или потрачено > 20 000 ₽', guestsCount: 3, totalRevenue: 292000, avgCheck: 8111, isAuto: true },
    { id: 3, name: 'Новый', color: '#2080f0', description: 'Первый визит на стадион', rules: 'Визитов ≤ 2 и зарегистрирован < 30 дней назад', guestsCount: 2, totalRevenue: 11000, avgCheck: 5500, isAuto: true },
    { id: 4, name: 'Корпоративный', color: '#f0a020', description: 'Корпоративные клиенты, групповые заказы', rules: 'Ручное присвоение менеджером', guestsCount: 1, totalRevenue: 155000, avgCheck: 51667, isAuto: false },
  ],
  teamMembers: [
    { id: 1, name: 'Александр Иванов', email: 'admin@fanzilla.ru', role: 'Владелец', status: 'active', lastActive: '2025-03-15T10:30:00' },
    { id: 2, name: 'Николай Крылов', email: 'n.krylov@luzhniki.ru', role: 'Администратор', status: 'active', lastActive: '2025-03-15T09:00:00' },
    { id: 3, name: 'Екатерина Воронова', email: 'e.voronova@luzhniki.ru', role: 'Менеджер билетов', status: 'active', lastActive: '2025-03-14T19:00:00' },
    { id: 4, name: 'Андрей Медведев', email: 'a.medvedev@luzhniki.ru', role: 'Менеджер билетов', status: 'active', lastActive: '2025-03-15T08:30:00' },
    { id: 5, name: 'Татьяна Ковалёва', email: 't.kovaleva@luzhniki.ru', role: 'Кассир', status: 'active', lastActive: '2025-03-15T07:00:00' },
    { id: 6, name: 'Виталий Орлов', email: 'v.orlov@luzhniki.ru', role: 'Контролёр', status: 'active', lastActive: '2025-03-14T22:00:00' },
    { id: 7, name: 'Борис Соколов', email: 'b.sokolov@luzhniki.ru', role: 'Контролёр', status: 'inactive', lastActive: '2025-01-31T18:00:00' },
  ],
}

// ============================================================
// MAP
// ============================================================
const allWorkspaceData = { 1: ws1, 2: ws2, 3: ws3 }

// ============================================================
// REACTIVE EXPORTS — auto-update on workspace switch
// ============================================================
function syncArray(target, source) {
  target.splice(0, target.length, ...source)
}
function syncObject(target, source) {
  for (const key of Object.keys(target)) delete target[key]
  Object.assign(target, source)
}

// Reactive arrays
export const venues = reactive([...ws1.venues])
export const events = reactive([...ws1.events])
export const pricingTemplates = reactive([...ws1.pricingTemplates])
export const tariffs = reactive([...ws1.tariffs])
export const ticketTypes = reactive([...ws1.ticketTypes])
export const services = reactive([...ws1.services])
export const orders = reactive([...ws1.orders])
export const tickets = reactive([...ws1.tickets])
export const guests = reactive([...ws1.guests])
export const accessLog = reactive([...ws1.accessLog])
export const priceCategories = reactive([...ws1.priceCategories])
export const venueZones = reactive([...ws1.venueZones])
export const rentalItems = reactive([...ws1.rentalItems])
export const promoCodes = reactive([...ws1.promoCodes])
export const orderServices = reactive([...ws1.orderServices])
export const addonOrders = reactive([...ws1.addonOrders])
export const segments = reactive([...ws1.segments])
export const teamMembers = reactive([...ws1.teamMembers])

// Reactive objects
export const templatePrices = reactive({ ...ws1.templatePrices })
export const dashboardMetrics = reactive({ ...ws1.dashboardMetrics })

function resolveRecordVenueId(record) {
  if (!record) return null
  if (record.venue !== undefined && record.venue !== null) return record.venue
  if (record.venueId !== undefined && record.venueId !== null) return record.venueId

  if (record.event) {
    const event = events.find(e => e.name === record.event)
    if (event) return event.venue
  }

  if (record.ticketId) {
    const ticket = tickets.find(t => t.id === record.ticketId)
    const venueId = resolveRecordVenueId(ticket)
    if (venueId !== null) return venueId
  }

  if (record.orderId) {
    const order = orders.find(o => o.id === record.orderId)
    const venueId = resolveRecordVenueId(order)
    if (venueId !== null) return venueId
  }

  if (record.parentOrderId) {
    const order = orders.find(o => o.id === record.parentOrderId)
    const venueId = resolveRecordVenueId(order)
    if (venueId !== null) return venueId
  }

  return null
}

export function matchesVenueContext(record) {
  if (selectedVenueFilter.value === 'all') return true
  return resolveRecordVenueId(record) === selectedVenueFilter.value
}

export function filterByVenueContext(items) {
  if (selectedVenueFilter.value === 'all') return [...items]
  return items.filter(matchesVenueContext)
}

// Watch workspace changes and sync all data
watch(currentWorkspaceId, (id) => {
  const ws = allWorkspaceData[id]
  if (!ws) return

  syncArray(venues, ws.venues)
  syncArray(events, ws.events)
  syncArray(pricingTemplates, ws.pricingTemplates)
  syncArray(tariffs, ws.tariffs)
  syncArray(ticketTypes, ws.ticketTypes)
  syncArray(services, ws.services)
  syncArray(orders, ws.orders)
  syncArray(tickets, ws.tickets)
  syncArray(guests, ws.guests)
  syncArray(accessLog, ws.accessLog)
  syncArray(priceCategories, ws.priceCategories)
  syncArray(venueZones, ws.venueZones)
  syncArray(rentalItems, ws.rentalItems)
  syncArray(promoCodes, ws.promoCodes)
  syncArray(orderServices, ws.orderServices)
  syncArray(addonOrders, ws.addonOrders)
  syncArray(segments, ws.segments)
  syncArray(teamMembers, ws.teamMembers)

  syncObject(templatePrices, ws.templatePrices)
  syncObject(dashboardMetrics, ws.dashboardMetrics)
})
