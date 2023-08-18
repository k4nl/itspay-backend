import { IUserFilter } from "../interfaces/user.interface";
import { IStoreFilter } from "../interfaces/store.interface";
import CustomError from "./CustomError";
import Validate from "./validate";
import moment from "moment";
import { statusCode } from "./status";

export default class Filter {

  static excludePaginationFields = ['page', 'limit'];
  
  static userFilterFields() {
    return {
      email: (value: string) => {
        const validate = new Validate('Email');
        validate.email(value);
        return value;
      },
      name: (value: string) => {
        const validate = new Validate('Name');
        validate.string(value);
        return { contains: value };
      },
      createdAt: (value: string) => {
        const validate = new Validate('CreatedAt');
        validate.timestamp(value);
        return moment(value, 'YYYY-MM-DD')
      },
      updatedAt: (value: string) => {
        const validate = new Validate('UpdatedAt');
        validate.timestamp(value);
        return moment(value, 'YYYY-MM-DD')
      },
    }
  }

  static storeFilterFields() {
    return {
      name: (value: string) => {
        const validate = new Validate('Name');
        validate.string(value);
        return { contains: value };
      },
      address: (value: string) => {
        const validate = new Validate('Address');
        validate.string(value);
        return { contains: value };
      },
      logo: (value: string) => {
        const validate = new Validate('Logo');
        validate.string(value);
        return { contains: value };
      },
      url: (value: string) => {
        const validate = new Validate('Url');
        validate.string(value);
        return { contains: value };
      },
      createdAt: (value: string) => {
        const validate = new Validate('CreatedAt');
        validate.timestamp(value);
        return moment(value, 'YYYY-MM-DD')
      },
      updatedAt: (value: string) => {
        const validate = new Validate('UpdatedAt');
        validate.timestamp(value);
        return moment(value, 'YYYY-MM-DD')
      },
      owner: (value: string) => {
        const validate = new Validate('Owner');
        validate.number(Number(value));
        return Number(value);
      },
      createdBy: (value: string) => {
        const validate = new Validate('CreatedBy');
        validate.number(Number(value));
        return Number(value);
      }
    }
  }

  static contructFilter(data: any, fields: any) {
    const filterObj = {};
    for (const [key, value] of Object.entries(data)) {
      if (fields[key]) {
        const updatedValue = fields[key](value);
        filterObj[key] = updatedValue;
      } else {
        if (this.excludePaginationFields.includes(key)) continue;
        throw new CustomError(statusCode.BAD_REQUEST, `Invalid filter field ${key}`);
      }
    }
    return filterObj;
  }

  static createUserFilter(data: IUserFilter) {
    try {
      const filterObj = this.contructFilter(data, this.userFilterFields());
      return filterObj;
    } catch (error) {
      throw error;
    }
  }

  static createStoreFilter(data: IUserFilter) {
    try {
      const filterObj = this.contructFilter(data, this.storeFilterFields());
      return filterObj;
    } catch (error) {
      throw error;
    }
  }
}