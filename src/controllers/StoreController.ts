import StoreServices from "../services/StoreServices";
import { IError } from "../interfaces/error.interface";
import { Response } from "express";
import Request from "../interfaces/request.interface";
import { statusCode } from "../utils/status";

export default class UserController {
  static async create(req: Request, res: Response) {
    try {
      const response = await StoreServices.create(req.body, req.user);
      return res.status(statusCode.CREATED).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const response = await StoreServices.findStoreById(Number(req.params.id));
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const response = await StoreServices.getAll(req.query);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      console.log(error)
      return res.status(error.status).json(error.data);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const response = await StoreServices.delete(Number(req.params.id));
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const response = await StoreServices.update(Number(req.params.id), req.body);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

}