import { User } from '../models/user.model';
import { IPaginationResponse } from './pagination.interface';

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
}

export interface IUserUpdate {
  name?: string;
  password?: string;
}

export interface IUserFindUnique {
  id?: number;
  email?: string;
}

export interface IUserFilter {
  email?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  page?: number;
  limit?: number;
  owner?: number;
  createdBy?: number;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id?: number;
  name?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}

export interface IUserPaginatedResponse {
  response: Partial<IUserResponse[]>;
  pagination?: IPaginationResponse;
}

export interface IUserAuth {
  id: number;
  email: number;
}