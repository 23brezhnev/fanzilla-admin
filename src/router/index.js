import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/DashboardView.vue')
  },
  // Events
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/events/EventsList.vue')
  },
  {
    path: '/events/create',
    name: 'EventCreate',
    component: () => import('../views/events/EventCreate.vue')
  },
  {
    path: '/events/:id',
    name: 'EventCard',
    component: () => import('../views/events/EventCard.vue')
  },
  // Sales - Orders
  {
    path: '/sales/orders',
    name: 'Orders',
    component: () => import('../views/sales/OrdersList.vue')
  },
  {
    path: '/sales/orders/:id',
    name: 'OrderCard',
    component: () => import('../views/sales/OrderCard.vue')
  },
  // Sales - Tickets
  {
    path: '/sales/tickets',
    name: 'Tickets',
    component: () => import('../views/sales/TicketsList.vue')
  },
  {
    path: '/sales/tickets/:id',
    name: 'TicketCard',
    component: () => import('../views/sales/TicketCard.vue')
  },
  // Pricing (unified)
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('../views/pricing/PricingView.vue')
  },
  {
    path: '/pricing/templates/create',
    name: 'PricingTemplateCreate',
    component: () => import('../views/pricing/TemplateCreate.vue')
  },
  {
    path: '/pricing/templates/:id',
    name: 'PricingTemplateEdit',
    component: () => import('../views/pricing/TemplateEdit.vue')
  },
  // Venues
  {
    path: '/venues',
    name: 'Venues',
    component: () => import('../views/venues/VenuesList.vue')
  },
  {
    path: '/venues/create',
    name: 'VenueCreate',
    component: () => import('../views/venues/VenueCreate.vue')
  },
  {
    path: '/venues/:id',
    name: 'VenueCard',
    component: () => import('../views/venues/VenueCard.vue')
  },
  // Catalog
  {
    path: '/catalog/services',
    name: 'CatalogServices',
    component: () => import('../views/catalog/CatalogServices.vue')
  },
  {
    path: '/catalog/subscriptions',
    name: 'Subscriptions',
    component: () => import('../views/catalog/SubscriptionsView.vue')
  },
  // Fulfillment
  {
    path: '/fulfillment/rental',
    name: 'Rental',
    component: () => import('../views/fulfillment/RentalView.vue')
  },
  {
    path: '/fulfillment/history',
    name: 'FulfillmentHistory',
    component: () => import('../views/fulfillment/HistoryView.vue')
  },
  // Access Control
  {
    path: '/access/log',
    name: 'AccessLog',
    component: () => import('../views/access/AccessLog.vue')
  },
  {
    path: '/access/zones',
    name: 'AccessZones',
    component: () => import('../views/access/ZonesSetup.vue')
  },
  {
    path: '/access/devices',
    name: 'AccessDevices',
    component: () => import('../views/access/DevicesView.vue')
  },
  // CRM
  {
    path: '/crm/guests',
    name: 'Guests',
    component: () => import('../views/crm/GuestsList.vue')
  },
  {
    path: '/crm/guests/:id',
    name: 'GuestCard',
    component: () => import('../views/crm/GuestCard.vue')
  },
  {
    path: '/crm/segments',
    name: 'Segments',
    component: () => import('../views/crm/SegmentsView.vue')
  },
  {
    path: '/crm/loyalty',
    name: 'Loyalty',
    component: () => import('../views/crm/LoyaltyView.vue')
  },
  // Analytics
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/analytics/AnalyticsView.vue')
  },
  // Settings
  {
    path: '/settings/general',
    name: 'SettingsGeneral',
    component: () => import('../views/settings/GeneralSettings.vue')
  },
  {
    path: '/settings/team',
    name: 'SettingsTeam',
    component: () => import('../views/settings/TeamSettings.vue')
  },
  {
    path: '/settings/channels',
    name: 'SettingsChannels',
    component: () => import('../views/settings/ChannelsSettings.vue')
  },
  {
    path: '/settings/integrations',
    name: 'SettingsIntegrations',
    component: () => import('../views/settings/IntegrationsSettings.vue')
  },
  // Promo
  {
    path: '/sales/promo',
    name: 'Promo',
    component: () => import('../views/sales/PromoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
