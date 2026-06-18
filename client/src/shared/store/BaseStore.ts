// shared/store/BaseStore.ts
import { makeAutoObservable, action } from 'mobx';

export interface ICrudService<T, CreateDto = Omit<T, 'id'>> {
  fetchAll(): Promise<T[]>;
  create(data: CreateDto): Promise<T>;
  update(id: number, data: Partial<CreateDto>): Promise<T>;
  delete(id: number): Promise<void>;
}

export abstract class BaseStore<T, CreateDto = Omit<T, 'id'>> {
  data: T[] = [];
  loading = false;
  error: Error | null = null;

  constructor(protected service: ICrudService<T, CreateDto>) {
    makeAutoObservable(this);
  }

  fetchAll = action(async () => {
    this.loading = true;
    this.error = null;
    try {
      this.data = await this.service.fetchAll();
    } catch (err) {
      this.error = err as Error;
    } finally {
      this.loading = false;
    }
  });

  create = action(async (dto: CreateDto): Promise<boolean> => {
    try {
      await this.service.create(dto);
      await this.fetchAll();
      return true;
    } catch (err) {
      this.error = err as Error;
      return false;
    }
  });

  update = action(async (id: number, dto: Partial<CreateDto>): Promise<boolean> => {
    try {
      await this.service.update(id, dto);
      await this.fetchAll();
      return true;
    } catch (err) {
      this.error = err as Error;
      return false;
    }
  });

  delete = action(async (id: number): Promise<boolean> => {
    try {
      await this.service.delete(id);
      await this.fetchAll();
      return true;
    } catch (err) {
      this.error = err as Error;
      return false;
    }
  });
}