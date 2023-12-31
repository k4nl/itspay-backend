import { IUserCreate, IUserFindUnique, IUserLogin, IUserUpdate } from "../../interfaces/user.interface";
import { User } from "../../models/user.model";
import CustomError from "../CustomError";
import Validate from ".";
import { statusCode } from "../status";

export default class ValidateUser extends Validate {

  static email(email: string) {
    const validate = new Validate('Email');
    validate.required(email);
    validate.string(email);
    validate.email(email);
  }

  static password(password: string) {
    const validate = new Validate('Password');
    validate.required(password);
    validate.string(password);
    if (password.length < 3) {
      throw new CustomError(statusCode.BAD_REQUEST, 'Password must be at least 3 characters');
    }
  }

  static userName(name: string) {
    const validate = new Validate('Name');
    validate.required(name);
    validate.string(name);
    if (name.length < 3) {
      throw new CustomError(statusCode.BAD_REQUEST, 'Name must be at least 3 characters');
    }
  }

  static userCreateData(data: IUserCreate) {
    ValidateUser.email(data.email);
    ValidateUser.password(data.password);
    ValidateUser.userName(data.name);
  }

  static loginData(data: IUserLogin) {
    ValidateUser.email(data.email);
    ValidateUser.password(data.password);
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
      throw new CustomError(statusCode.BAD_REQUEST, 'User already exists');
    }
  }

  static userNotFound(user: Partial<User> | null, message?: string) {
    if(!user) {
      throw new CustomError(statusCode.NOT_FOUND, `${`User ${message} not found`}`);
    }
  }

  static uniqueKey(key: IUserFindUnique) {
    if (!key.id && !key.email) {
      throw new CustomError(statusCode.BAD_REQUEST, 'Key must have id or email');
    }
    if (key.email) {
      ValidateUser.email(key.email);
    }
    if (key.id) {
      const validate = new Validate('Id');
      validate.number(key.id);
      if (key.id < 1) {
        throw new CustomError(statusCode.BAD_REQUEST, 'Id must be at least 1');
      }
    }
  }
}