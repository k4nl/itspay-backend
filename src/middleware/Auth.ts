import { IUserLogin } from "../interfaces/user.interface";
import { PrismaClient } from "@prisma/client";
import { User } from "../models/user.model";
import Bcrypt from "../utils/Bcrypt";
import Validate from "../utils/ValidateUser";

export default class Auth {
  private static prisma = new PrismaClient();

  static async login(loginData: IUserLogin): Promise<Partial<User> | null> {
    Validate.loginData(loginData);
    const response: User = await this.prisma.user.findUnique({ where: { email: loginData.email } });
    Validate.userNotFound(response);
    await Bcrypt.compare(loginData.password, response.password);
    return { name: response.name, email: response.email, id: response.id };
  }

}