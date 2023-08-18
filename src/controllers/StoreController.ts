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
      const response = await StoreServices.findStoreById(req.params.id);
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
      return res.status(error.status).json(error.data);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const response = await StoreServices.delete(req.params.id);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      if (!error.status) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      return res.status(error.status).json(error.data);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const response = await StoreServices.update(req.params.id, req.body);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }
}