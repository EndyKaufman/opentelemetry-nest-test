import { AsyncLocalStorage } from 'async_hooks';

// https://docs.nestjs.com/recipes/async-local-storage

export const asl = new AsyncLocalStorage<any>();
