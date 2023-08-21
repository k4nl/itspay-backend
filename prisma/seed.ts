import { faker } from '@faker-js/faker';
import { User } from '../src/models/user.model';
import { Store } from '../src/models/store.model';
import { UserStores } from '../src/models/userStores.model';

import { IUserCreate, IUserResponse } from '../src/interfaces/user.interface';
import { IStoreCreate } from '../src/interfaces/store.interface';
import { PrismaClient } from '@prisma/client'
import { verify } from 'crypto';
const prisma = new PrismaClient()

interface IStoreCreateWithCreatedBy extends IStoreCreate {
  createdBy: number;
}

const generateUsersCreate = () => {
  const users: IUserCreate[] = [];
  for (let i = 0; i <= 50; i++) {
    const user = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
    users.push(user);
  }
  return users;
}

const generateStoreCreate = (users: Partial<User[]>) => {
  if (!users.length) return [];
  const stores: IStoreCreateWithCreatedBy[] = [];
  for (let i = 0; i <= 50; i++) {
    const owner = users[Math.floor(Math.random() * users.length)]?.id;
    const createdBy = users[Math.floor(Math.random() * users.length)]?.id;
    if (!owner || !createdBy) continue;
    const store = {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      logo: faker.image.url(),
      url: faker.internet.url(),
      createdAt: new Date(),
      updatedAt: null,
      createdBy,
    }
    stores.push(store as any);
  }
  return stores;
}

const generateUserStores = (users: Partial<User[]>, stores: any[]) => {
  if (!users.length || !stores.length) return [];
  const userStores: UserStores[] = [];
  for (let i = 0; i <= stores.length; i++) {
    const storeId = stores[i]?.id;
    const ownerId = users[Math.floor(Math.random() * users.length)]?.id;
    if (!storeId || !ownerId) continue;
    const userStore = {
      storeId,
      ownerId,
      createdAt: new Date(),
      updatedAt: null,
    }
    userStores.push(userStore as any);
  }
  return userStores;
};

const verifyUserAlreadySeed = async (): Promise<boolean> => {
  const response: Partial<User[]> = await prisma.user.findMany();
  if (response.length) return true;
  return false
}

const verifyStoreAlreadySeed = async () => {
  const response = await prisma.store.findMany();
  if (response.length) return true;
  return false
}

const verifyUserStoresAlreadySeed = async () => {
  const response = await prisma.userStores.findMany();
  if (response.length) return true;
  return false
}

async function main() {
  const users: IUserCreate[] = generateUsersCreate();
  const userAlreadySeed = await verifyUserAlreadySeed();
  if (!userAlreadySeed) {
    await prisma.user.createMany({ data: users, skipDuplicates: true });
  }
  const response: Partial<User[]> = await prisma.user.findMany();
  const stores = generateStoreCreate(response);
  const storeAlreadySeed = await verifyStoreAlreadySeed();
  if (!storeAlreadySeed) {
    await prisma.store.createMany({ data: stores, skipDuplicates: true });
  }
  const userStoresAlreadySeed = await verifyUserStoresAlreadySeed();
  if (!userStoresAlreadySeed) {
    const storesResponse = await prisma.store.findMany({ select: { id: true }});
    const userStores = generateUserStores(response, storesResponse);
    await prisma.userStores.createMany({ data: userStores, skipDuplicates: true });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
  });