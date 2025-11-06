// Definición de permisos por módulo y rol
export const PERMISSIONS = {
  SUPERADMIN: {
    users: ['create', 'read', 'update', 'delete', 'assign-roles'],
    modules: ['create', 'read', 'update', 'delete', 'configure'],
    attractions: ['create', 'read', 'update', 'delete'],
    restaurants: ['create', 'read', 'update', 'delete'],
    foods: ['create', 'read', 'update', 'delete'],
    events: ['create', 'read', 'update', 'delete'],
    hotels: ['create', 'read', 'update', 'delete'],
    categories: ['create', 'read', 'update', 'delete'],
    routes: ['create', 'read', 'update', 'delete'],
    points: ['create', 'read', 'update', 'delete'],
    announcements: ['create', 'read', 'update', 'delete'],
    analytics: ['read', 'export']
  },
  ADMIN: {
    users: ['read'],
    modules: ['read'],
    attractions: ['create', 'read', 'update'],
    restaurants: ['create', 'read', 'update'],
    foods: ['create', 'read', 'update'],
    events: ['create', 'read', 'update'],
    hotels: ['create', 'read', 'update'],
    categories: ['read'],
    routes: ['create', 'read', 'update'],
    points: ['create', 'read', 'update'],
    announcements: ['create', 'read', 'update'],
    analytics: ['read']
  },
  MANTENEDOR: {
    attractions: ['read', 'update'],
    restaurants: ['read', 'update'],
    foods: ['read', 'update'],
    events: ['read', 'update'],
    hotels: ['read', 'update'],
    categories: ['read'],
    routes: ['read'],
    points: ['read'],
    announcements: ['read'],
    analytics: ['read']
  }
};

// Hook personalizado para verificar permisos
export const usePermissions = (role, module, action) => {
  if (!role || !module || !action) return false;
  return PERMISSIONS[role]?.[module]?.includes(action) || false;
};

// Función para verificar acceso a elementos específicos
export const hasElementAccess = (user, moduleId, elementId) => {
  if (user.role === 'SUPERADMIN') return true;
  
  // Verificar accesos específicos asignados al usuario
  return user.moduleAccess?.[moduleId]?.elements?.includes(elementId) || false;
};

// Constantes de módulos
export const MODULES = {
  USERS: 'users',
  ATTRACTIONS: 'attractions',
  RESTAURANTS: 'restaurants',
  FOODS: 'foods',
  EVENTS: 'events',
  HOTELS: 'hotels',
  CATEGORIES: 'categories',
  ROUTES: 'routes',
  POINTS: 'points',
  ANNOUNCEMENTS: 'announcements',
  ANALYTICS: 'analytics'
};