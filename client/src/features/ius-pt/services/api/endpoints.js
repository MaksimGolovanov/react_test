export const ENDPOINTS = {
    // Подписи (администраторы)
    SIGNATURES: {
        BASE: '/iuspt/adm',
        BY_ID: (id) => `/iuspt/adm/${id}`,
    },
    
    // Роли
    ROLES: {
        BASE: '/iuspt/roles',
        BY_ID: (id) => `/iuspt/roles/${id}`,
        BULK: '/iuspt/roles/bulk',
    },
    
    // Пользователи
    USERS: {
        BASE: '/iuspt/users',
        BY_ID: (id) => `/iuspt/users/${id}`,
    },
    
    // Роли пользователей
    USER_ROLES: {
        BASE: '/iuspt/user-roles',
        BY_USER: (tabNumber) => `/iuspt/user-roles/${tabNumber}`,
        BY_USER_AND_ROLE: (tabNumber, roleId) => `/iuspt/user-roles/${tabNumber}/${roleId}`,
        BULK: '/iuspt/user-roles/bulk',
    },
    
    // Сотрудники
    STAFF: {
        WITH_IUS_USER: '/iuspt/staff-with-iususer',
        WITH_USER: '/iuspt/staff-with-user',
        BY_TAB_NUMBER: (tabNumber) => `/iuspt/staff-with-iususer-tabnumber/${tabNumber}`,
        SIMPLE: '/iuspt/staff-with-iususer-simple',
        SIMPLE_OVER: '/iuspt/staff-with-iususer-simple-over',
    },
    
    // Стоп-роли
    STOP_ROLES: {
        BASE: '/iuspt/stoproles',
        BY_ID: (id) => `/iuspt/stoproles/${id}`,
    },
};