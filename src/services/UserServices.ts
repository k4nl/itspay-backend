// import User from "database/models/User";
import Validate from "../utils/Validate";
import CustomError from "../utils/CustomError";
import { IUserCreate } from "interfaces/user-create.interface";
import { PrismaClient } from "@prisma/client";
import { User } from "../models/user.model";


class UserService {
  private static prisma = new PrismaClient();

  static async findByEmail(email: string): Promise<Partial<User> | null> {
    const response: User | null = await this.prisma.user.findUnique({ where: { email } });
    if (!response) return null;

    return { name: response.name, email: response.email, id: response.id };
  }

  static async create(userData: IUserCreate): Promise<Partial<User>> {
    Validate.userCreateData(userData);
    const userExists = await this.findByEmail(userData.email);
    Validate.userAlreadyExists(userExists);
    const response: User = await this.prisma.user.create({ data: userData });
    return { name: response.name, email: response.email, id: response.id };
  }
}

export default UserService;