import { BaseService } from './BaseService';
import { ENDPOINTS } from '../api/endpoints';

export class StaffService extends BaseService {

    async fetchWithUser() {
        return this.get(ENDPOINTS.STAFF.WITH_USER);
    }

    async fetchWithIusUser() {
        return this.get(ENDPOINTS.STAFF.WITH_IUS_USER);
    }

    async fetchByTabNumber(tabNumber) {
        return this.get(ENDPOINTS.STAFF.BY_TAB_NUMBER(tabNumber));
    }

    async fetchSimple() {
        return this.get(ENDPOINTS.STAFF.SIMPLE);
    }

    async fetchSimpleOver() {
        return this.get(ENDPOINTS.STAFF.SIMPLE_OVER);
    }
}