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