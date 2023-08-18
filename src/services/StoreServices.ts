import { IStoreCreate, IStoreUpdate } from "../interfaces/store.interface";
import { IUserAuth } from "../interfaces/user.interface";
import { PrismaClient } from "@prisma/client";
import { Store } from "../models/store.model";
import Filter from "../utils/Filter";
import Pagination from "../utils/Pagination";
import Validate from "../utils/validate/ValidateStore";
import ValidateUser from "../utils/validate/ValidateUser";
import UserService from "./UserServices";

class StoreServices {
  private static prisma = new PrismaClient();
  private static includeUserStores = {
  id:true,
  name:true,
  url:true,
  logo:true,
  address:true,
  createdAt:true,
  updatedAt:true,
  createdBy:false,
  owner: {
      select: {
        userInfo: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    },
    createdByUser: {
      select: {
        name: true,
        id: true,
      }
    }
  }

  static async create(storeData: IStoreCreate, userData: IUserAuth): Promise<Store> {
    Validate.validateStore(storeData);
    const user = await UserService.findByUniqueKey({ id: storeData.owner });
    ValidateUser.userNotFound(user);
    const response: Store = await this.prisma.store.create({
      data: {
        name: storeData.name,
        address: storeData.address,
        logo: storeData.logo,
        url: storeData.url,
        createdAt: new Date(),
        createdByUser: {
          connect: {
            id: userData.id
          }
        },
        owner: {
          create: {
            ownerId: storeData.owner
          }
        }
      },
    });

    Validate.response(response);

    return response;
  }

  static async findStoreById(id: number): Promise<Store>  {
    Validate.id(id);
    const response: Store = await this.prisma.store.findUnique({
      where: { id },
      select: this.includeUserStores,
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
    Validate.response(response);  
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
      select: this.includeUserStores,
      take: limit,
      skip: offset,
    });
    return response;
  }

}

export default StoreServices;