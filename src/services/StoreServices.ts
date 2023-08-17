import { IStoreCreate, IStoreUpdate } from "../interfaces/store.interface";
import { IUserAuth } from "../interfaces/user.interface";
import { PrismaClient } from "@prisma/client";
import { Store } from "../models/store.model";
import Filter from "../utils/Filter";
import Pagination from "../utils/Pagination";
import Auth from "../middleware/Auth";
import Validate from "../utils/validate/ValidateStore";

class StoreServices {
  private static prisma = new PrismaClient();

  static async create(storeData: IStoreCreate, userData: IUserAuth): Promise<Store> {
    Validate.validateStore(storeData);
    const response: Store = await this.prisma.store.create({
      data: {...storeData, createdBy: userData.id, createdAt: new Date() }
    });
    return response;
  }

  static async findStoreById(id: number): Promise<Store>  {
    Validate.id(id);
    const response: Store = await this.prisma.store.findUnique({
      where: { id }
    });
    Validate.found(response);
    return response;
  }

  static async update(id: number, storeData: IStoreUpdate): Promise<Store> {
    await this.findStoreById(id);
    Validate.validateStoreUpdate(storeData);
    const response: Store = await this.prisma.store.update({
      where: { id },
      data: { ...storeData, updatedAt: new Date() }
    });
    return response;
  }

  static async delete(id: number): Promise<void> {
    await this.findStoreById(id);
    await this.prisma.store.delete({
      where: { id }
    });
  }

  static async getAll(filter: any): Promise<Store[]>  {
    const filterData = Filter.createStoreFilter(filter);
    const { limit, offset } = Pagination.handlePage(filter);
    const response: Store[] = await this.prisma.store.findMany({
      where: { ...filterData },
      take: limit,
      skip: offset,
    });
    return response;
  }

}

export default StoreServices;