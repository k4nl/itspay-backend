import Validate from ".";
import CustomError from "../CustomError";
import { IStoreCreate, IStoreUpdate } from "../../interfaces/store.interface";
import { statusCode } from "../status";
import { Store } from "models/store.model";


export default class ValidateStore extends Validate {

  static updateFields: string[] = ['name', 'address', 'logo', 'url'];

  static storeName(name: string) {
    const validate = new Validate('Name');
    validate.required(name);
    validate.string(name);
  }

  static adress(address: string) {
    const validate = new Validate('Address');
    validate.required(address);
    validate.string(address);
  }

  static logo(logo: string) {
    const validate = new Validate('Logo');
    validate.required(logo);
    validate.string(logo);
  }

  static url(url: string) {
    const validate = new Validate('Url');
    validate.required(url);
    validate.string(url);
  }

  static id(id: number) {
    if (!id) throw new CustomError( statusCode.BAD_REQUEST,'Id is required');
    if (typeof id !== 'number') throw new CustomError( statusCode.BAD_REQUEST,'Id must be a number');
  }

  static found(store: Store) {
    if (!store) throw new CustomError( statusCode.NOT_FOUND,'Store not found');
  }

  static validateStoreUpdate(storeData: IStoreUpdate): void {
    if (!storeData) throw new CustomError( statusCode.BAD_REQUEST,'Store data is required');
    for (const [field, value] of Object.entries(storeData)) {
      if (!this.updateFields.includes(field)) throw new CustomError( statusCode.BAD_REQUEST,`Invalid field ${field}`);
      const validate = new Validate(field);
      validate.string(value);
      validate.required(value);
    }
  }


  static validateStore(storeData: IStoreCreate): void {
    ValidateStore.storeName(storeData.name);
    ValidateStore.adress(storeData.address);
    ValidateStore.logo(storeData.logo);
    ValidateStore.url(storeData.url);
  }
}