// Definición de tipos de módulos y sus campos
export const MODULE_TYPES = {
  TOURIST_ATTRACTIONS: {
    id: 'attractions',
    name: 'Atractivos Turísticos',
    icon: 'fa-landmark',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'accessibility', type: 'text', label: 'Accesibilidad' },
      { name: 'available', type: 'boolean', label: 'Disponible' },
      { name: 'categories', type: 'select', multiple: true, label: 'Categorías' },
      { name: 'contact', type: 'object', label: 'Contacto' },
      { name: 'coverUrl', type: 'image', label: 'Imagen de portada' },
      { name: 'faq', type: 'array', label: 'Preguntas frecuentes' },
      { name: 'foods', type: 'array', label: 'Comidas' },
      { name: 'location', type: 'object', label: 'Ubicación' },
      { name: 'coords', type: 'map', label: 'Coordenadas' },
      { name: 'mainCategories', type: 'select', multiple: true, label: 'Categorías principales' },
      { name: 'order', type: 'number', label: 'Orden' },
      { name: 'rating', type: 'number', label: 'Calificación' }
    ]
  },
  RESTAURANTS: {
    id: 'restaurants',
    name: 'Restaurantes',
    icon: 'fa-utensils',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'location', type: 'map', required: true },
      { name: 'images', type: 'gallery', multiple: true },
      { name: 'cuisine', type: 'select', required: true },
      { name: 'priceRange', type: 'select', required: true },
      { name: 'menu', type: 'file', accept: '.pdf' },
      { name: 'schedule', type: 'schedule' },
      { name: 'contact', type: 'contact' }
    ]
  },
  FOODS: {
    id: 'foods',
    name: 'Comidas',
    icon: 'fa-hamburger',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'images', type: 'gallery', multiple: true },
      { name: 'category', type: 'select', required: true },
      { name: 'ingredients', type: 'tags', multiple: true },
      { name: 'price', type: 'number' },
      { name: 'spiciness', type: 'select' }
    ]
  },
  EVENTS: {
    id: 'events',
    name: 'Eventos',
    icon: 'fa-calendar-alt',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'location', type: 'map', required: true },
      { name: 'images', type: 'gallery', multiple: true },
      { name: 'startDate', type: 'datetime', required: true },
      { name: 'endDate', type: 'datetime', required: true },
      { name: 'category', type: 'select', required: true },
      { name: 'price', type: 'number' },
      { name: 'contact', type: 'contact' }
    ]
  },
  HOTELS: {
    id: 'hotels',
    name: 'Hoteles',
    icon: 'fa-hotel',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'location', type: 'map', required: true },
      { name: 'images', type: 'gallery', multiple: true },
      { name: 'category', type: 'select', required: true },
      { name: 'amenities', type: 'tags', multiple: true },
      { name: 'priceRange', type: 'select', required: true },
      { name: 'contact', type: 'contact' }
    ]
  },
  TOURIST_ROUTES: {
    id: 'routes',
    name: 'Rutas Turísticas',
    icon: 'fa-route',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'points', type: 'points', multiple: true },
      { name: 'duration', type: 'duration', required: true },
      { name: 'difficulty', type: 'select', required: true },
      { name: 'images', type: 'gallery', multiple: true },
      { name: 'recommendations', type: 'textarea' }
    ]
  },
  POINTS_OF_INTEREST: {
    id: 'points',
    name: 'Puntos de Interés',
    icon: 'fa-map-marker-alt',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'location', type: 'map', required: true },
      { name: 'category', type: 'select', required: true },
      { name: 'images', type: 'gallery', multiple: true }
    ]
  },
  ANNOUNCEMENTS: {
    id: 'announcements',
    name: 'Anuncios',
    icon: 'fa-bullhorn',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'content', type: 'richtext', required: true },
      { name: 'image', type: 'image' },
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true },
      { name: 'target', type: 'select', required: true }
    ]
  },
  CATEGORIES: {
    id: 'categories',
    name: 'Categorías',
    icon: 'fa-tags',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      { name: 'parent', type: 'select' },
      { name: 'icon', type: 'icon' },
      { name: 'moduleType', type: 'select', required: true }
    ]
  }
};

// Campos comunes que se pueden reutilizar
export const COMMON_FIELDS = {
  contact: [
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'website', type: 'url' },
    { name: 'socialMedia', type: 'social' }
  ],
  schedule: [
    { name: 'monday', type: 'timeRange' },
    { name: 'tuesday', type: 'timeRange' },
    { name: 'wednesday', type: 'timeRange' },
    { name: 'thursday', type: 'timeRange' },
    { name: 'friday', type: 'timeRange' },
    { name: 'saturday', type: 'timeRange' },
    { name: 'sunday', type: 'timeRange' }
  ],
  location: [
    { name: 'address', type: 'text', required: true },
    { name: 'coordinates', type: 'map', required: true },
    { name: 'city', type: 'select', required: true },
    { name: 'zone', type: 'text' }
  ]
};

export const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'qu', name: 'Quechua' }
];