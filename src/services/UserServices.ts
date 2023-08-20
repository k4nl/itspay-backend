import {
  IUserCreate,
  IUserFindUnique,
  IUserUpdate,
  IUserFilter,
  IUserLogin,
  IUserResponse,
  IUserPaginatedResponse,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";
import Bcrypt from "../utils/Bcrypt";
import Validate from "../utils/validate/ValidateUser";
import Filter from "../utils/Filter";
import Pagination from "../utils/Pagination";
import Auth from "../middleware/Auth";
import client from "../../prisma/client";

class UserService {
  private static prisma = client;
  private static excludePassword = {
    password: false,
    id: true,
    createdAt: true,
    updatedAt: true,
    email: true,
    name: true 
  };

  static async findByUniqueKey(key: IUserFindUnique): Promise<IUserResponse> {
    const response: Partial<User> | null = key.id
      ? await this.prisma.user.findUnique({ where: { id: key.id }, select: this.excludePassword })
      : await this.prisma.user.findUnique({ where: { email: key.email }, select: this.excludePassword })
    if (!response) return null;
    return response;
  }

  static async create(userData: IUserCreate): Promise<IUserResponse> {
    const userExists = (await this.findByUniqueKey({ email: userData.email }));
    Validate.userAlreadyExists(userExists);
    const hashedPassword = await Bcrypt.hash(userData.password);
    const response: Partial<User> = await this.prisma.user.create({ data: { ...userData, password: hashedPassword }, select: this.excludePassword });
    return { ...response, token: Auth.createToken({ id: response.id, email: response.email }) };
  }

  static async update(id: number, userData: IUserUpdate): Promise<Partial<User>> {
    const userExists = await this.findByUniqueKey({ id })
    Validate.userNotFound(userExists);
    const hashedPassword = userData.password ? await Bcrypt.hash(userData.password) : undefined;
    const newData = hashedPassword ? { ...userData, password: hashedPassword, updatedAt: new Date() } : { ...userData, updatedAt: new Date() };
    const response: Partial<User> = await this.prisma.user.update({ where: { id }, data: newData, select: this.excludePassword });
    return { name: response.name, email: response.email, id: response.id };
  }

  static async delete(id: number): Promise<void> {
    const userExists = await this.findByUniqueKey({ id });
    Validate.userNotFound(userExists);
    await this.prisma.user.delete({ where: { id } });
  }

  static async getAll(filter: IUserFilter | null | undefined): Promise<IUserPaginatedResponse> {
    const filterObj = Filter.createUserFilter(filter);
    const { limit, offset } = Pagination.handlePage(filter);
    const response: IUserResponse[] = await this.prisma.user.findMany({
      where: filterObj,
      select: {...this.excludePassword },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });
    const total = await this.prisma.user.count({ where: filterObj });
    return { response, pagination: { limit, total, page: filter.page || 1, pageSize: response.length } };
  }

  static async login(loginData: IUserLogin): Promise<IUserResponse | null> {
    const response: User = await this.prisma.user.findUnique({ where: { email: loginData.email } });
    Validate.userNotFound(response, loginData.email);
    await Bcrypt.compare(loginData.password, response.password);
    return { name: response.name, email: response.email, id: response.id, token: Auth.createToken({ id: response.id, email: response.email }) };
  }

}

export default UserService;