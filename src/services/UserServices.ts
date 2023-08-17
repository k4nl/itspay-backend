import { IUserCreate, IUserFindUnique, IUserUpdate, IUserFilter } from "../interfaces/user.interface";
import { PrismaClient } from "@prisma/client";
import { User } from "../models/user.model";
import { hash } from "bcrypt";
import Validate from "../utils/ValidateUser";
import Filter from "../utils/Filter";
import Pagination from "../utils/Pagination";

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

  static async filter(filter: IUserFilter): Promise<Partial<User>[]> {
    const filterObj = Filter.createUserFilter(filter);
    const { limit, offset } = Pagination.handlePage(filter);
    const response: User[] = await this.prisma.user.findMany({
      where: filterObj,
      select: this.excludePassword,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });
    return response;
  }

  static async getAll(filter: IUserFilter | null | undefined): Promise<Partial<User>[]> {
    if (filter) return this.filter(filter);
    const { limit, offset } = new Pagination().defaultPagination;
    const response: User[] = await this.prisma.user.findMany({
      select: this.excludePassword,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });
    return response;
  }


}

export default UserService;