import { BaseService } from './BaseService';
import { ENDPOINTS } from '../api/endpoints';

export class SignatureService extends BaseService {

    async fetchAll() {
        return this.get(ENDPOINTS.SIGNATURES.BASE);
    }

    async create(signature) {
        return this.post(ENDPOINTS.SIGNATURES.BASE, signature);
    }

    async update(signature) {
        return this.put(ENDPOINTS.SIGNATURES.BASE, signature);
    }

    async delete(id) {
        return this.deleteRequest(ENDPOINTS.SIGNATURES.BY_ID(id));
    }
}