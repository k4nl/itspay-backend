import { IUserCreate, IUserFindUnique, IUserUpdate } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import CustomError from "./CustomError";
import Validate from "./Validate";

export default class ValidateUser extends Validate {

  static email(email: string) {
    const validate = new Validate('Email');
    validate.required(email);
    validate.string(email);
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      throw new CustomError(400, 'Invalid email');
    }
  }

  static password(password: string) {
    const validate = new Validate('Password');
    validate.required(password);
    validate.string(password);
    if (password.length < 3) {
      throw new CustomError(400, 'Password must be at least 3 characters');
    }
  }

  static userName(name: string) {
    const validate = new Validate('Name');
    validate.required(name);
    validate.string(name);
    if (name.length < 3) {
      throw new CustomError(400, 'Name must be at least 3 characters');
    }
  }

  static userCreateData(data: IUserCreate) {
    ValidateUser.email(data.email);
    ValidateUser.password(data.password);
    ValidateUser.userName(data.name);
  }

  static userUpdateData(data: IUserUpdate) {
    if(data.name) {
      ValidateUser.userName(data.name);
    }
    if(data.password) {
      ValidateUser.password(data.password);
    }
  }

  static userAlreadyExists(user: Partial<User> | null) {
    if(user) {
      throw new CustomError(400, 'User already exists');
    }
  }

  static userNotFound(user: Partial<User> | null) {
    if(!user) {
      throw new CustomError(404, 'User not found');
    }
  }

  static uniqueKey(key: IUserFindUnique) {
    if (!key.id && !key.email) {
      throw new CustomError(400, 'Key must have id or email');
    }
    if (key.email) {
      ValidateUser.email(key.email);
    }
    if (key.id) {
      const validate = new Validate('Id');
      validate.number(key.id);
      if (key.id < 1) {
        throw new CustomError(400, 'Id must be at least 1');
      }
    }
  }
}