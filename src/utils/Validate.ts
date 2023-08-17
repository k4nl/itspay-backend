import { IUserCreate } from "../interfaces/user-create.interface";
import { User } from "../models/user.model";
import CustomError from "./CustomError";

export default class Validate {

  static email(email: string) {
    if(!email) {
      throw new CustomError(400, 'Email is required');
    }
    if (typeof email !== 'string') {
      throw new CustomError(400, 'Email must be a string');
    }
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      throw new CustomError(400, 'Invalid email');
    }
  }

  static password(password: string) {
    if(!password) {
      throw new CustomError(400, 'Password is required');
    }
    if (typeof password !== 'string') {
      throw new CustomError(400, 'Password must be a string');
    }
    if (password.length < 3) {
      throw new CustomError(400, 'Password must be at least 3 characters');
    }
  }

  static userName(name: string) {
    if(!name) {
      throw new CustomError(400, 'Name is required');
    }
    if (typeof name !== 'string') {
      throw new CustomError(400, 'Name must be a string');
    }
    if (name.length < 3) {
      throw new CustomError(400, 'Name must be at least 3 characters');
    }
  }

  static userCreateData(data: IUserCreate) {
    Validate.email(data.email);
    Validate.password(data.password);
    Validate.userName(data.name);
  }

  static userAlreadyExists(user: Partial<User> | null) {
    if(user) {
      throw new CustomError(400, 'User already exists');
    }
  }
}