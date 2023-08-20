import { User } from "../mocks/user.mock";
import {
  IUserCreate,
  IUserUpdate,
  IUserFilter,
  IUserLogin,
} from "../../interfaces/user.interface";
import CustomError from "../../utils/CustomError";
import { statusCode } from "../../utils/status";
import UserServices from "../../services/UserServices";
import client from '../../../prisma/client';
import Bcrypt from "../../utils/Bcrypt";
import ValidateUser from "../../utils/validate/ValidateUser";

const user = new User();
const updatedUser = { ...user, name: `${user.name} Sobrenome` };
const wrongEmail = 'wrongemail';
const userNotFound = new CustomError(statusCode.NOT_FOUND, 'User not found');
const wrongPassword = new CustomError(statusCode.BAD_REQUEST, 'Password must be at least 3 characters');

jest.mock('../../../prisma/client', () => ({
  user: {
    findUnique: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Gustavo',
      email: 'gustavo@email.com',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
    }),
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Gustavo',
      email: 'gustavo@email.com',
      createdAt: new Date('2021/01/01'),
      updatedAt: null,
    }),
    update: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Gustavo Sobrenome',
      email: 'gustavo@email.com',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
    }),
    delete: jest.fn().mockResolvedValue(undefined),
    findMany: jest.fn().mockResolvedValue([{
      id: 1,
      name: 'Gustavo',
      email: 'gustavo@email.com',
      createdAt: new Date('2021/01/01'),
      updatedAt: new Date('2021/01/01'),
    }]),
    count: jest.fn().mockResolvedValue(1),

  }
}));

jest.mock('../../utils/Bcrypt', () => ({
  hash: jest.fn().mockResolvedValueOnce('hashedPassword'),
  compare: jest.fn().mockResolvedValueOnce(true),
}));

jest.mock('../../middleware/Auth', () => ({
  createToken: jest.fn().mockReturnValue('token'),
}));

jest.mock('../../utils/validate/ValidateUser', () => ({
  userAlreadyExists: jest.fn(),
  userNotFound: jest.fn().mockResolvedValueOnce(undefined),
}));

jest.mock('../../utils/Filter', () => ({
  createUserFilter: jest.fn().mockReturnValueOnce({}),
}));

jest.mock('../../utils/Pagination', () => ({
  handlePage: jest.fn().mockReturnValueOnce({ limit: 10, offset: 0 }),
}));

describe('UserServices', () => {

  afterEach(() => {
    jest.clearAllMocks();
  })
  
  
  describe('findByUniqueKey', () => {

    it('should return a user if id is provided', async () => {
      // Arrange
      const id = user.id;
      const expected = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      // Act
      const result = await UserServices.findByUniqueKey({ id });

      // Assert
      expect(result).toEqual(expected);
    });



    it('should return a user if email is provided', async () => {
      // Arrange
      const email = user.email;
      const expected = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      // Act
      const result = await UserServices.findByUniqueKey({ email });


      // Assert
      expect(result).toEqual(expected);
    });

    it('should return null if user is not found', async () => {
      // Arrange
      (client.user.findUnique as jest.Mock).mockResolvedValueOnce(null);


      // Act
      const result = await UserServices.findByUniqueKey({ id: 2 });

      // Assert
      expect(result).toBeNull();
    });

  });

  describe('create', () => {
    it('should create a user', async () => {
      // Arrange
      const userData: IUserCreate = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
      
      const { password, ...expectedFields } = user;
      const expected = { ...expectedFields, updatedAt: null };

      // Act

      const result = await UserServices.create(userData);

      // Assert

      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Arrange
      const id = user.id;
      const userData: IUserUpdate = {
        name: `${user.name} Sobrenome`,
      };
      
      const { password, createdAt, updatedAt, token, ...expectedFields } = updatedUser;
      
      const expected = {...expectedFields, name: `${user.name} Sobrenome`};

      // Act

      const result = await UserServices.update(id, userData);

      // Assert

      expect(result).toEqual(expected);
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const id = 2;
      const userData: IUserUpdate = {
        name: `${user.name} Sobrenome`,
        password: user.password,
      };
      (client.user.update as jest.Mock).mockRejectedValueOnce(userNotFound);

      try {
        // Act
        await UserServices.update(id, userData);
      } catch (error) {

        // Assert
        expect(error).toEqual(userNotFound);

      }

    });
    it('should throw an error if password is invalid', async () => {
      // Arrange
      const id = user.id;
      const userData: IUserUpdate = {
        name: `${user.name} Sobrenome`,
        password: '12',
      };

      (client.user.update as jest.Mock).mockRejectedValueOnce(wrongPassword)

      try {
        // Act
        await UserServices.update(id, userData);
      } catch (error) {
        // Assert
        expect(error).toEqual(wrongPassword);
      }
    });
  });


  describe('delete', () => {
    it('should delete a user', async () => {
      // Arrange
      const id = user.id;
      
      // Act

      const result = await UserServices.delete(id);

      // Assert

      expect(result).toBeUndefined();
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const id = 2;
      (client.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      
      // Act

      try {
        await UserServices.delete(id);
      } catch (error) {
        // Assert
        expect(error).toEqual(userNotFound);
      }
    });
  });

  describe('getAll', () => {
    it('should return a list of users', async () => {
      // Arrange
      const filter: IUserFilter = {
        name: user.name,
        email: user.email,
      };

      const { password, token, ...userResponse } = user
      const pagination = { limit: 10, page: 1, pageSize: 1, total: 1 };
      
      const response = {response: [userResponse], pagination };

      // Act

      const getAllresult = await UserServices.getAll(filter);

      // Assert

      expect(getAllresult).toEqual(response);
    });
  });

  describe('login', () => {
    it('should return a user if email and password are correct', async () => {
      // Arrange
      const userData: IUserLogin = {
        email: user.email,
        password: user.password,
      };
      
      const {createdAt, updatedAt, password, ...expected} = user;

      // Act

      const result = await UserServices.login(userData);

      // Assert

      expect(result).toEqual(expected);
    });

    it('should throw an error if email is wrong', async () => {
      // Arrange
      const userData: IUserLogin = {
        email: wrongEmail,
        password: user.password,
      };

      (ValidateUser.userNotFound as jest.Mock).mockImplementationOnce(() => {
        throw userNotFound;
      })

      try {
        // Act
        await UserServices.login(userData);
      } catch (error) {
        // Assert
        expect(error).toEqual(userNotFound);
      }

    });

    it('should throw an error if password is wrong', async () => {
      // Arrange
      const userData: IUserLogin = {
        email: user.email,
        password: '12',
      };

      (Bcrypt.compare as jest.Mock).mockRejectedValueOnce(wrongPassword);

      try {

        // Act
        await UserServices.login(userData);
        
      } catch (error) {
        
        // Assert
        expect(error).toEqual(wrongPassword);
      }


    });
  });

});
