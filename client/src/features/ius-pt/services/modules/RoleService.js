import { BaseService } from './BaseService';
import { ENDPOINTS } from '../api/endpoints';

export class RoleService extends BaseService {

    async fetchAll() {
        return this.get(ENDPOINTS.ROLES.BASE);
    }

    async create(role) {
        return this.post(ENDPOINTS.ROLES.BASE, role);
    }

    async update(role) {
        return this.put(ENDPOINTS.ROLES.BASE, role);
    }

    async delete(id) {
        return this.deleteRequest(ENDPOINTS.ROLES.BY_ID(id));
    }

    async bulkCreate(roles) {
        return this.post(ENDPOINTS.ROLES.BULK, roles);
    }
}