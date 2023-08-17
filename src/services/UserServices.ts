import { IUserCreate, IUserFindUnique, IUserUpdate } from "interfaces/user.interface";
import { PrismaClient } from "@prisma/client";
import { User } from "../models/user.model";
import { hash } from "bcrypt";
import Validate from "../utils/ValidateUser";

class UserService {
  private static prisma = new PrismaClient();
  private static excludePassword = {
    password: false,
    id: true,
    createdAt: true,
    updatedAt: true,
    email: true,
    name: true 
  };

  static async findByUniqueKey(key: IUserFindUnique): Promise<Partial<User> | null> {
    console.log(key);
    Validate.uniqueKey(key);
    const response: Partial<User> | null = key.id
      ? await this.prisma.user.findUnique({ where: { id: key.id }, select: this.excludePassword })
      : await this.prisma.user.findUnique({ where: { email: key.email }, select: this.excludePassword })
    if (!response) return null;
    return response;
  }

  static async create(userData: IUserCreate): Promise<Partial<User>> {
    Validate.userCreateData(userData);
    const userExists = await this.findByUniqueKey({ email: userData.email });
    Validate.userAlreadyExists(userExists);
    const hashedPassword = await hash(userData.password, 10);
    const response: Partial<User> = await this.prisma.user.create({ data: { ...userData, password: hashedPassword }, select: this.excludePassword });
    return response;
  }

  static async update(id: number, userData: IUserUpdate): Promise<Partial<User>> {
    Validate.userUpdateData(userData);
    const userExists = await this.findByUniqueKey({ id });
    Validate.userNotFound(userExists);
    const hashedPassword = userData.password ? await hash(userData.password, 10) : undefined;
    const newData = hashedPassword ? { ...userData, password: hashedPassword, updatedAt: new Date() } : { ...userData, updatedAt: new Date() };
    const response: Partial<User> = await this.prisma.user.update({ where: { id }, data: newData, select: this.excludePassword });
    return { name: response.name, email: response.email, id: response.id };
  }

  static async delete(id: number): Promise<void> {
    const userExists = await this.findByUniqueKey({ id });
    Validate.userNotFound(userExists);
    await this.prisma.user.delete({ where: { id } });
  }

  static async getAll(): Promise<Partial<User>[]> {
    const response: User[] = await this.prisma.user.findMany({
      select: this.excludePassword,
      orderBy: {
        createdAt: 'desc'
      }
    });
    return response;
  }

}

export default UserService;