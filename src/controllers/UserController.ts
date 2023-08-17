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
      return res.status(error.status).json(error.data);
    }
  }
}