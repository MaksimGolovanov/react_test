import { BaseService } from './BaseService';
import { ENDPOINTS } from '../api/endpoints';

export class StopRoleService extends BaseService {
 
    async fetchAll() {
        return this.get(ENDPOINTS.STOP_ROLES.BASE);
    }

    async create(stopRole) {
        return this.post(ENDPOINTS.STOP_ROLES.BASE, stopRole);
    }

    async update(id, stopRoleData) {
        return this.put(ENDPOINTS.STOP_ROLES.BY_ID(id), stopRoleData);
    }

    async delete(id) {
        return this.deleteRequest(ENDPOINTS.STOP_ROLES.BY_ID(id));
    }
}