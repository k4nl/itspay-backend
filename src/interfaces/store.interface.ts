import { Store } from '../models/store.model';
import { IPaginationResponse } from './pagination.interface';

export interface IStoreCreate {
  name: string,
  address: string,
  logo: string,
  url: string,
  owner: number
}

export interface IStoreUpdate {
  name?: string,
  address?: string,
  logo?: string,
  url?: string
  owner?: number
}

export interface IStoreFilter {
  name?: string,
  address?: string,
  logo?: string,
  url?: string,
  createdAt?: string,
  updatedAt?: string,
  page?: string,
  limit?: string,
  owner?: string,
  createdBy?: string
}

export interface IStorePaginatedResponse {
  response: Store[],
  pagination: IPaginationResponse
}
