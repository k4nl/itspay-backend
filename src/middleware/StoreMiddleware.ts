import ValidateStore from "../utils/validate/ValidateStore";
import { Response, NextFunction } from "express";
import Request from "../interfaces/request.interface";
import { IError } from "../interfaces/error.interface";

export default class StoreMiddleware {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateStore.validateStore(req.body);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async findStoreById(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateStore.id(req.params.id);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateStore.id(req.params.id);
      ValidateStore.validateStoreUpdate(req.body);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateStore.id(req.params.id);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async deleteMany(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateStore.storesId(req.query.ids);
      req.query.ids = JSON.parse(req.query.ids);
      next();
    } catch (error: IError | any) {
      console.log(error)
      return res.status(error.status).json(error.data);
    }
  }
}