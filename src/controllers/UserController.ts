import UserServices from "../services/UserServices";
import { IError } from "../interfaces/error.interface";
import { Request, Response } from "express";
import { statusCode } from "../utils/status";

export default class UserController {
  static async create(req: Request, res: Response) {
    try {
      const response = await UserServices.create(req.body);
      return res.status(statusCode.CREATED).json(response);
    } catch (error: IError | any) {
      console.log(error);
      return res.status(error.status).json(error.data);
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const response = await UserServices.findByUniqueKey({ id: Number(req.params.id) });
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const response = await UserServices.getAll(req.query);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      console.log(error)
      return res.status(error.status).json(error.data);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const response = await UserServices.delete(Number(req.params.id));
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const response = await UserServices.update(Number(req.params.id), req.body);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const response = await UserServices.login(req.body);
      return res.status(statusCode.SUCCESS).json(response);
    } catch (error: IError | any) {
      return res.status(error.status).json(error.data);
    }
  }
}