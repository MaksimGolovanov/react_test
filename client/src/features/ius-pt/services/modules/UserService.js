import { BaseService } from './BaseService';
import { ENDPOINTS } from '../api/endpoints';

export class UserService extends BaseService {
   

    async fetchAll() {
        return this.get(ENDPOINTS.USERS.BASE);
    }

    async createOrUpdate(user) {
        return this.post(ENDPOINTS.USERS.BASE, user);
    }

    async delete(id) {
        return this.deleteRequest(ENDPOINTS.USERS.BY_ID(id));
    }

    async fetchUserRoles(tabNumber) {
        return this.get(ENDPOINTS.USER_ROLES.BY_USER(tabNumber));
    }

    async createUserRole(userRole) {
        return this.post(ENDPOINTS.USER_ROLES.BASE, userRole);
    }

    async deleteUserRole(tabNumber, roleId) {
        if (!tabNumber || !roleId) {
            throw new Error('Не указаны tabNumber или roleId');
        }
        return this.deleteRequest(
            ENDPOINTS.USER_ROLES.BY_USER_AND_ROLE(tabNumber, roleId)
        );
    }

    async addRolesToUser(tabNumber, roleIds) {
        return this.post(ENDPOINTS.USER_ROLES.BULK, { tabNumber, roleIds });
    }
}