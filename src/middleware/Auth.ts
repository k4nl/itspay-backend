import { User } from "../models/user.model";
import Validate from "../utils/validate";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { statusCode } from "../utils/status";
import UserServices from "../services/UserServices";
require("dotenv").config();

export default class Auth {


  static createToken(user: Partial<User>): string {
    return jwt.sign({ user }, process.env.SECRET_KEY as string, {
      expiresIn: "24h",
    });
  }

  static async validateToken(request: any, response: Response, next: any) {
    try {
      Validate.headers(request.headers);
      const authorization = request.headers.authorization;
      const decoded = jwt.verify(authorization, process.env.SECRET_KEY as string);
      Validate.token(decoded);
      const user = await UserServices.findByUniqueKey({ id: decoded['user'].id });
      request.user = decoded['user'];
      next();
    } catch (error) {
      return response.status(statusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
  }
}