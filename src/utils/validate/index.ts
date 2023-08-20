import CustomError from "../CustomError";
import moment from "moment";
import { statusCode } from "../status";

export default class Validate {
  isRequired: string;
  isInvalid: string;
  
  constructor(type: string) {
    this.isRequired = `${type} is required`;
    this.isInvalid = `Invalid ${type} type, it must be`;
  }

  required(value: any) {
    if(!value) {
      throw new CustomError(statusCode.BAD_REQUEST, this.isRequired);
    }
  }

  string(value: string) {
    if (typeof value !== 'string') {
      throw new CustomError(statusCode.BAD_REQUEST, `${this.isInvalid} a string`);
    }
  }

  number(value: string | number) {
    if (isNaN(Number(value))) {
      throw new CustomError(statusCode.BAD_REQUEST, `${this.isInvalid} a number`);
    }
  }

  email(value: string) {
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(value)) {
      throw new CustomError(statusCode.BAD_REQUEST, 'Invalid email');
    }
  }

  timestamp(value: string | Date) {
    const date = moment(value, 'DD-MM-YYYY');
    if (!date.isValid()) {
      throw new CustomError(statusCode.BAD_REQUEST, 'Invalid date');
    }
  }

  static token(isValid: any) {
    if (!isValid) {
      throw new CustomError(statusCode.UNAUTHORIZED, 'Unauthorized');
    }
  }

  static user(user: any) {
    if (!user) {
      throw new CustomError(statusCode.UNAUTHORIZED, 'Unauthorized');
    }
  }

  static headers(headers: any) {
    if (!headers.authorization) {
      throw new CustomError(statusCode.UNAUTHORIZED, 'Unauthorized');
    }
  }
}