import { AsyncLocalStorage } from 'async_hooks';

export const asl = new AsyncLocalStorage<any>();
