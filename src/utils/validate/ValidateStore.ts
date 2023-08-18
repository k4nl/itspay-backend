import Validate from ".";
import CustomError from "../CustomError";
import { IStoreCreate, IStoreUpdate } from "../../interfaces/store.interface";
import { statusCode } from "../status";
import { Store } from "models/store.model";


export default class ValidateStore extends Validate {

  static updateFields: string[] = ['name', 'address', 'logo', 'url', 'owner'];

  static empty(data: any) {
    if (Object.keys(data).length === 0) throw new CustomError( statusCode.BAD_REQUEST, 'No data to update');
  }

  static owner(owner: number) {
    const validate = new Validate('Owner');
    validate.required(owner);
    validate.number(owner);
  }

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

  static id(id: string) {
    if (!id) throw new CustomError( statusCode.BAD_REQUEST,'Id is required');
    if (isNaN(Number(id))) throw new CustomError( statusCode.BAD_REQUEST,'Id must be a number');
  }

  static found(store: Store) {
    if (!store) throw new CustomError( statusCode.NOT_FOUND,'Store not found');
  }

  static validateStoreUpdate(storeData: IStoreUpdate): void {
    ValidateStore.empty(storeData);
    for (const [field, value] of Object.entries(storeData)) {
      if (!this.updateFields.includes(field)) throw new CustomError( statusCode.BAD_REQUEST,`Invalid field ${field}`);
      const validate = new Validate(field);
      if (field === 'owner') {
        validate.required(value);
        validate.number(value);
        continue;
      }
      validate.string(value);
      validate.required(value);
    }
  }

  static validateStore(storeData: IStoreCreate): void {
    ValidateStore.storeName(storeData.name);
    ValidateStore.adress(storeData.address);
    ValidateStore.logo(storeData.logo);
    ValidateStore.url(storeData.url);
    ValidateStore.owner(storeData.owner);
  }

  static response(response: Store): void {
    if (!response) throw new CustomError( statusCode.INTERNAL_SERVER_ERROR,'Error creating store');
  }

}