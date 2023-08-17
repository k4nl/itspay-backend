import CustomError from "./CustomError";

export default class Validate {
  isRequired: string;
  isInvalid: string;
  
  constructor(type: string) {
    this.isRequired = `${type} is required`;
    this.isInvalid = `Invalid ${type} type, it must be`;
  }

  required(value: any) {
    if(!value) {
      throw new CustomError(400, this.isRequired);
    }
  }

  string(value: string) {
    if (typeof value !== 'string') {
      throw new CustomError(400, `${this.isInvalid} a string`);
    }
  }

  number(value: number) {
    if (typeof value !== 'number') {
      throw new CustomError(400, `${this.isInvalid} a number`);
    }
  }
}