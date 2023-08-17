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
  id?: number;
  email?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  page?: number;
  limit?: number;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAuth {
  id: number;
  email: number;
}