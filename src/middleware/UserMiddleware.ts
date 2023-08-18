import ValidateUser from "../utils/validate/ValidateUser";
import { Request, Response, NextFunction } from "express";
import { IError } from "../interfaces/error.interface";

export default class UserMiddleware {

  static async findByUniqueKey(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateUser.uniqueKey(req.body);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateUser.userCreateData(req.body);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateUser.userUpdateData(req.body);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateUser.uniqueKey(req.params);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      ValidateUser.loginData(req.body);
      next();
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }
}