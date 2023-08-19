import { Response } from "express";
import IRequest from "../../interfaces/request.interface";
import UserController from "../../controllers/UserController";
import UserServices from "../../services/UserServices";
import {
  User,
} from "../mocks/user.mock";

import CustomError from "../../utils/CustomError";
import { statusCode } from "../../utils/status";

let mockRequest = {} as IRequest;
let mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  header: jest.fn()
} as unknown as Response;

jest.mock("../../services/UserServices", () => ({
  findByUniqueKey: jest.fn().mockResolvedValue({
    id: 1,
    email: "gustavo@email.com"
  }),
  create: jest.fn().mockResolvedValue({
    id: 1,
    name: "Gustavo",
    email: "gustavo@email.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    token: 'token'
  }),
  update: jest.fn().mockResolvedValue({
    id: 1,
    name: "Gustavo",
    email: "gustavo@email.com",
  }),
  delete: jest.fn().mockResolvedValue({}),
  login: jest.fn().mockResolvedValue({
    id: 1,
    name: "Gustavo",
    email: "gustavo@email.com",
    token: 'token'
  }),
  getAll: jest.fn().mockResolvedValue({
    response: [
      {
        id: 1,
        name: "Gustavo",
        email: "gustavo@email.com",
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      pageSize: 1,
      total: 1
    }
  }),
}));

describe("User Controller", () => {
  beforeEach(() => {
    mockRequest = {} as IRequest;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      header: jest.fn()
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      // Arrange
      const user = new User();
      mockRequest.body = { name: user.name, email: user.email, password: user.password };
      const response = { id: user.id, email: user.email, name: user.name, createdAt: expect.any(Date), updatedAt: expect.any(Date), token: expect.any(String) };
      
  
      // Act
  
      await UserController.create(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it("should return a user already exists error", async () => {
      // Arrange
      const user = new User();
      mockRequest.body = { name: user.name, email: user.email, password: user.password }
      const error = new CustomError(statusCode.BAD_REQUEST, 'User already exists');
      (UserServices.create as jest.Mock).mockRejectedValueOnce(error);
  
      // Act
  
      await UserController.create(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });
  });

  describe("get", () => {
    it("should return a user successfully", async () => {
      // Arrange
      const user = new User();
      mockRequest.params = { id: user.id };
      const response = { id: user.id, email: user.email };
      
  
      // Act
  
      await UserController.get(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.findByUniqueKey).toHaveBeenCalledWith(mockRequest.params);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it("should return a user not found error", async () => {
      // Arrange
      const user = new User();
      mockRequest.params = { id: user.id };
      const error = new CustomError(statusCode.NOT_FOUND, 'User not found');
      (UserServices.findByUniqueKey as jest.Mock).mockRejectedValueOnce(error);
  
      // Act
  
      await UserController.get(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.findByUniqueKey).toHaveBeenCalledWith(mockRequest.params);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);

    });
  });

  describe("update", () => {
    it("should update a user successfully", async () => {
      // Arrange
      const user = new User();
      mockRequest.params = { id: user.id };
      mockRequest.body = { name: `${user.name}3`, password: `${user.password}a` };
      const response = { id: user.id, email: user.email, name: user.name };
      
  
      // Act
  
      await UserController.update(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.update).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });
  
    it("should return a user not found error", async () => {
      // Arrange
      const user = new User();
      mockRequest.params = { id: user.id };
      mockRequest.body = { name: `${user.name}3`, password: `${user.password}a` };
      const error = new CustomError(statusCode.NOT_FOUND, 'User not found');
      (UserServices.update as jest.Mock).mockRejectedValueOnce(error);
  
      // Act
  
      await UserController.update(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.update).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
  
    });
  });
  describe("login", () => {
    it("should login a user successfully", async () => {
      // Arrange
      const user = new User();
      mockRequest.body = { email: user.email, password: user.password };
      const response = { id: user.id, email: user.email, name: user.name, token: expect.any(String) };
      
  
      // Act
  
      await UserController.login(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });
  
    it("should return a user not found error", async () => {
      // Arrange
      const user = new User();
      mockRequest.body = { email: user.email, password: user.password };
      const response = { id: user.id, email: user.email, name: user.name, token: expect.any(String) };
      const error = new CustomError(statusCode.NOT_FOUND, 'User not found');
      (UserServices.login as jest.Mock).mockRejectedValueOnce(error);
  
      // Act
  
      await UserController.login(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
  
    });

    it("should return a unauthorized error if wrong password", async () => {
      // Arrange
      const user = new User();
      mockRequest.body = { email: user.email, password: user.password };
      const response = { id: user.id, email: user.email, name: user.name, token: expect.any(String) };
      const error = new CustomError(statusCode.UNAUTHORIZED, 'Invalid password');
      (UserServices.login as jest.Mock).mockRejectedValueOnce(error);
  
      // Act
  
      await UserController.login(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });
  
  });

  describe("delete", () => {
    it("should delete a user successfully", async () => {
      // Arrange
      const user = new User();
      mockRequest.params = { id: user.id };
      
  
      // Act
  
      await UserController.delete(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.delete).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  
    it("should return a user not found error", async () => {
      // Arrange
      const user = new User();
      mockRequest.params = { id: user.id };
      const error = new CustomError(statusCode.NOT_FOUND, 'User not found');
      (UserServices.delete as jest.Mock).mockRejectedValueOnce(error);
  
      // Act
  
      await UserController.delete(mockRequest, mockResponse);
  
      // Assert
  
      expect(UserServices.delete).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });
  });

  describe("getAll", () => {
    it("should get all users successfully", async () => {
      // Arrange
      const user = new User();
      mockRequest.query = { page: 1, limit: 10 };
      const response = [{ id: user.id, email: user.email, name: user.name }];
      const pagination = { page: 1, limit: 10, pageSize: 1, total: 1 };

      mockResponse.header = jest.fn().mockReturnValue({
        'Current-Page': '1',
        'Page-Size': '1',
        'Total-Count': '1',
        'Total-Pages': '1'
      });
    
      mockResponse.getHeader = jest.fn().mockReturnValue('1');
      
    
      // Act
    
      await UserController.getAll(mockRequest, mockResponse);
    
      // Assert
    
      expect(UserServices.getAll).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
      expect(mockResponse.getHeader('Current-Page')).toBe('1');
      expect(mockResponse.getHeader('Page-Size')).toBe('1');
      expect(mockResponse.getHeader('Total-Count')).toBe('1');
      expect(mockResponse.getHeader('Total-Pages')).toBe('1');
    });
  
  });

});

