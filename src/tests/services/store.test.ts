import { Store } from "../mocks/store.mock";
import { User } from "../mocks/user.mock";
import { Owner } from "../mocks/owner.mock";
import { CreatedByUser } from "../mocks/createdByUser.mock";
import {
  IStoreCreate,
  IStoreUpdate,
  IStoreFilter,
  IStorePaginatedResponse,
} from "../../interfaces/store.interface";
import CustomError from "../../utils/CustomError";
import { statusCode } from "../../utils/status";
import StoreServices from "../../services/StoreServices";
import client from '../../../prisma/client';
import Bcrypt from "../../utils/Bcrypt";
import ValidateStore from "../../utils/validate/ValidateStore";
import ValidateUser from "../../utils/validate/ValidateUser";


const store = new Store();
const owner = new Owner();
const createdByUser = new CreatedByUser();
const {password, createdAt, updatedAt, token, name, ...user} = new User();
const storeNotFound = new CustomError(statusCode.NOT_FOUND, 'Store not found');
const userNotFound = new CustomError(statusCode.NOT_FOUND, 'User not found');
const errorCreatingStore = new CustomError( statusCode.INTERNAL_SERVER_ERROR,'Error creating store')

jest.mock('../../../prisma/client', () => ({
  store: {
    findUnique: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Store',
      address: 'Address',
      logo: 'Logo',
      url: 'Url',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
      owner: {
        userInfo: {
          id: 1,
          name: 'Gustavo',
        }
      },
      createdByUser: {
        id: 1,
        name: 'Gustavo',
      },
    }),
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Store',
      address: 'Address',
      logo: 'Logo',
      url: 'Url',
      createdAt: new Date('2021/01/01'),
      updatedAt: null,
      owner: {
        userInfo: {
          id: 1,
          name: 'Gustavo',
        }
      },
      createdByUser: {
        id: 1,
        name: 'Gustavo',
      },
    }),
    update: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Store 1',
      address: 'Address 1',
      logo: 'Logo 1',
      url: 'Url 1',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
      owner: {
        userInfo: {
          id: 1,
          name: 'Gustavo',
        }
      },
      createdByUser: {
        id: 1,
        name: 'Gustavo',
      },
    }),
    delete: jest.fn().mockResolvedValue(undefined),
    deleteMany: jest.fn().mockResolvedValue(undefined),
    findMany: jest.fn().mockResolvedValue([{
      id: 1,
      name: 'Store',
      address: 'Address',
      logo: 'Logo',
      url: 'Url',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
      owner: {
        userInfo: {
          id: 1,
          name: 'Gustavo',
        }
      },
      createdByUser: {
        id: 1,
        name: 'Gustavo',
      },
    }]),
    count: jest.fn().mockResolvedValue(1),
  },
  user: {
    findUnique: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Gustavo',
      email: 'gustavo@email.com',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
    }),
  }
}));


jest.mock('../../utils/validate/ValidateStore', () => ({
  validateStore: jest.fn(),
  validateStoreUpdate: jest.fn(),
  validateStoreFilter: jest.fn(),
  allStoresFound: jest.fn(),
  response: jest.fn(),
  found: jest.fn(),
}));

jest.mock('../../utils/Pagination', () => ({
  handlePage: jest.fn().mockReturnValueOnce({ limit: 10, offset: 0 }),
}));

jest.mock('../../utils/validate/ValidateUser', () => ({
  userNotFound: jest.fn().mockResolvedValueOnce(undefined),
}));

jest.mock('../../utils/Filter', () => ({
  createStoreFilter: jest.fn().mockReturnValueOnce({}),
}));

jest.mock('../../utils/Pagination', () => ({
  handlePage: jest.fn().mockReturnValueOnce({ limit: 10, offset: 0 }),
}));

describe('StoreServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('create', () => {
    
    it('should create a store', async () => {
      // Arrange
      const storeData: IStoreCreate = {
        name: store.name,
        address: store.address,
        logo: store.logo,
        url: store.url,
        owner: user.id,
      };


      // Act
      const response = await StoreServices.create(storeData, user);

      // Assert
      expect(response).toEqual({ ...store, updatedAt: null, owner, createdByUser });
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const storeData: IStoreCreate = {
        name: store.name,
        address: store.address,
        logo: store.logo,
        url: store.url,
        owner: user.id,
      };
      
      (ValidateUser.userNotFound as jest.Mock).mockImplementationOnce(() => {
        throw userNotFound;
      });

      // Act
      const result = StoreServices.create(storeData, user);

      // Assert
      await expect(result).rejects.toThrowError(userNotFound);
    });

    it('should throw an error if store could not be created', async () => {
      // Arrange
      const storeData: IStoreCreate = {
        name: store.name,
        address: store.address,
        logo: store.logo,
        url: store.url,
        owner: user.id,
      };
      
      (ValidateStore.response as jest.Mock).mockImplementationOnce(() => {
        throw errorCreatingStore;
      });

      // Act
      const result = StoreServices.create(storeData, user);

      // Assert
      await expect(result).rejects.toThrowError(errorCreatingStore);
    });
  });

  describe('findStoreById', () => {

    it('should find a store by id', async () => {
      // Arrange
      const id = store.id;

      // Act
      const response = await StoreServices.findStoreById(id.toString());
      // Assert
      expect(response).toEqual({...store, owner, createdByUser });
    });

    it('should throw an error if store is not found', async () => {
      // Arrange
      const id = 2;
      (client.store.findUnique as jest.Mock).mockRejectedValueOnce(storeNotFound);

      // Act
      const result = StoreServices.findStoreById(id.toString());

      // Assert
      await expect(result).rejects.toThrowError(storeNotFound);
    });

  });

  describe('update', () => {

    it('should update a store', async () => {
      // Arrange
      const id = store.id;
      const updatedStore = new Store().update();
      const storeData: IStoreUpdate = {
        name: updatedStore.name,
        address: updatedStore.address,
        logo: updatedStore.logo,
        url: updatedStore.url,
        owner: user.id,
      };

      // Act

      const response = await StoreServices.update(id.toString(), storeData);

      // Assert


      expect(response).toEqual({ ...updatedStore, owner, createdByUser });
    });

    it('should throw an error if store is not found', async () => {
      // Arrange
      const id = 2;
      const updatedStore = new Store().update();
      const storeData: IStoreUpdate = {
        name: updatedStore.name,
        address: updatedStore.address,
        logo: updatedStore.logo,
        url: updatedStore.url,
        owner: user.id,
      };

      (client.store.findUnique as jest.Mock).mockRejectedValueOnce(storeNotFound);

      // Act
      const result = StoreServices.update(id.toString(), storeData);

      // Assert
      await expect(result).rejects.toThrowError(storeNotFound);
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const id = store.id;
      const updatedStore = new Store().update();
      const storeData: IStoreUpdate = {
        name: updatedStore.name,
        address: updatedStore.address,
        logo: updatedStore.logo,
        url: updatedStore.url,
        owner: user.id,
      };

      (ValidateUser.userNotFound as jest.Mock).mockImplementationOnce(() => {
        throw userNotFound;
      });

      // Act
      const result = StoreServices.update(id.toString(), storeData);

      // Assert
      await expect(result).rejects.toThrowError(userNotFound);
    });
  });

  describe('delete', () => {
      
      it('should delete a store', async () => {
        // Arrange
        const id = store.id;
  
        // Act
        const response = await StoreServices.delete(id.toString());
  
        // Assert
        expect(response).toBeUndefined();
      });
  
      it('should throw an error if store is not found', async () => {
        // Arrange
        const id = 2;
        (client.store.findUnique as jest.Mock).mockRejectedValueOnce(storeNotFound);
  
        // Act
        const result = StoreServices.delete(id.toString());
  
        // Assert
        await expect(result).rejects.toThrowError(storeNotFound);
      });
  
  });

  describe('deleteMany', () => {
    it('should delete many stores', async () => {
      // Arrange
      const ids = [store.id];

      // Act
      const response = await StoreServices.deleteMany(ids);

      // Assert
      expect(response).toBeUndefined();
    });

    it('should throw an error if store is not found', async () => {
      // Arrange
      const ids = [2];
      (ValidateStore.allStoresFound as jest.Mock).mockImplementationOnce(() => {
        throw storeNotFound;
      });

      // Act
      const result = StoreServices.deleteMany(ids);

      // Assert
      await expect(result).rejects.toThrowError(storeNotFound);
    });

  });

  describe('getAll', () => {

    it('should get all stores', async () => {
      // Arrange
      const filter: IStoreFilter = {
        name: store.name,
        address: store.address,
        logo: store.logo,
        url: store.url,
        owner: user.id.toString(),
      };
      const response = {
        response: [{...store, owner, createdByUser }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pageSize: 1,
        }
      };
      // Act
      const result = await StoreServices.getAll(filter);

      console.log('result', result);
      console.log('response', response);

      // Assert
      expect(result).toEqual(response);
    });
  });

});
