import { IUserFilter } from "interfaces/user.interface";
import CustomError from "./CustomError";
import Validate from "./Validate";
import moment from "moment";

export default class Filter {
  
  static userFilterFields() {
    return {
      id: (value: any) => {
        const validate = new Validate('Id');
        validate.number(Number(value));
        return Number(value);
      },
      email: (value: any) => {
        const validate = new Validate('Email');
        validate.email(value);
        return value;
      },
      name: (value: any) => {
        const validate = new Validate('Name');
        validate.string(value);
        return { contains: value };
      },
      createdAt: (value: any) => {
        const validate = new Validate('CreatedAt');
        validate.timestamp(value);
        return moment(value, 'YYYY-MM-DD')
      },
      updatedAt: (value: any) => {
        const validate = new Validate('UpdatedAt');
        validate.timestamp(value);
        return moment(value, 'YYYY-MM-DD')
      },
    }
  }

  static createUserFilter(data: IUserFilter) {
    const filterObj = {};
    const filterFields = this.userFilterFields();
    for (const [key, value] of Object.entries(data)) {
      if (filterFields[key]) {
        const updatedValue = filterFields[key](value);
        filterObj[key] = updatedValue;
      } else {
        throw new CustomError(400, `Invalid filter field ${key}`);
      }
    }
    return filterObj;
  }
}