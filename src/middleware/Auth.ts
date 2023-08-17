import { User } from "../models/user.model";
import Validate from "../utils/validate";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { statusCode } from "../utils/status";
require("dotenv").config();

export default class Auth {

  static createToken(user: Partial<User>): string {
    return jwt.sign({ user }, process.env.SECRET_KEY as string, {
      expiresIn: "24h",
    });
  }

  static validateToken(request: any, response: Response, next: any) {
    try {
      Validate.headers(request.headers);
      const authorization = request.headers.authorization;
      const decoded = jwt.verify(authorization, process.env.SECRET_KEY as string);
      Validate.token(decoded);
      request.user = decoded;
      next();
    } catch (error) {
      return response.status(statusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
  }
}