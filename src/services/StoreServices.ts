import { IStoreCreate, IStoreUpdate, IStorePaginatedResponse } from "../interfaces/store.interface";
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

  static async findStoreById(id: string): Promise<Store>  {
    const response: Store = await this.prisma.store.findUnique({
      where: { id: Number(id) },
      select: this.includeUserStores,
    });
    Validate.found(response);
    return response;
  }

  static async update(id: string, storeData: IStoreUpdate): Promise<Store> {
    await this.findStoreById(id);
    if (storeData.owner) {
      const user = await UserService.findByUniqueKey({ id: storeData.owner });
      ValidateUser.userNotFound(user);
    }
    const { owner, ...data } = storeData;
    const response: Store = await this.prisma.store.update({
      where: { id: Number(id) },
      data: { ...data, updatedAt: new Date(), owner: { update: { ownerId: owner } } },
    });
    return response;
  }

  static async deleteMany(ids: number[]): Promise<void> {
    const stores = await this.prisma.store.findMany({ where: { id: { in: ids.map(Number) } }, select: { id: true } });
    console.log(stores);
    console.log(typeof ids[0]);
    Validate.allStoresFound(stores, ids);
    await this.prisma.store.deleteMany({ where: { id: { in: ids.map(Number) } } });
  }
  
  static async delete(id: string): Promise<void> {
    await this.findStoreById(id);
    await this.prisma.store.delete({
      where: { id: Number(id) }
    });
  }

  static async getAll(filter: any): Promise<IStorePaginatedResponse>  {
    const filterData = Filter.createStoreFilter(filter);
    const { limit, offset } = Pagination.handlePage(filter);
    const response: Store[] = await this.prisma.store.findMany({
      where: { ...filterData },
      select: this.includeUserStores,
      take: limit,
      skip: offset,
    });

    console.log(response);

    const total = await this.prisma.store.count({ where: { ...filterData } });

    return { response, pagination: { limit, total, page: filter.page || 1, pageSize: response.length } };
  }

}

export default StoreServices;