import { Response } from "express";
import IRequest from "../../interfaces/request.interface";
import StoreController from "../../controllers/StoreController";
import StoreServices from "../../services/StoreServices";
import {
  Store,
} from "../mocks/store.mock";
import {
  User,
} from "../mocks/user.mock";

import CustomError from "../../utils/CustomError";
import { statusCode } from "../../utils/status";

let mockRequest = {} as IRequest;
let mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  header: jest.fn(),
  getHeader: jest.fn(),
} as unknown as Response;

const userNotFound = new CustomError(statusCode.NOT_FOUND, "User 1 not found");
const storeNotFound = new CustomError(statusCode.NOT_FOUND, "Store not found");

jest.mock("../../services/StoreServices", () => ({
  create: jest.fn().mockResolvedValue({
    name: "Store",
    address: "Address",
    logo: "Logo",
    url: "Url",
    id: 1,
    createdAt: new Date('2021/01/01'),
    updatedAt: null,
  }),
  findStoreById: jest.fn().mockResolvedValue({
    name: "Store",
    address: "Address",
    logo: "Logo",
    url: "Url",
    id: 1,
    createdAt: new Date('2021/01/01'),
    updatedAt: new Date('2021/01/01'),
  }),
  update: jest.fn().mockResolvedValue({
    name: "Store 1",
    address: "Address 1",
    logo: "Logo 1",
    url: "Url 1",
    id: 1,
    createdAt: new Date('2021/01/01'),
    updatedAt: new Date('2021/01/01'),
  }),
  deleteMany: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  getAll: jest.fn().mockResolvedValue({
    response: [
      {
        name: "Store",
        address: "Address",
        logo: "Logo",
        url: "Url",
        id: 1,
        createdAt: new Date('2021/01/01'),
        updatedAt: new Date('2021/01/01'),
      },
      {
        name: "Store",
        address: "Address",
        logo: "Logo",
        url: "Url",
        id: 2,
        createdAt: new Date('2021/01/01'),
        updatedAt: new Date('2021/01/01'),
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      pageSize: 1
    }
  }),
}));


describe("StoreController", () => {

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

    it("should create store successfully", async () => {
      // Arrange
      const {id, createdAt, updatedAt, ...store } = new Store();
      const user = new User();
      mockRequest.body = store
      mockRequest.user = { id: user.id, email: user.email }

      // Act

      await StoreController.create(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.create).toHaveBeenCalledWith(store, mockRequest.user);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ ...store, id, createdAt, updatedAt: null });

    });

    it("should return a user not found error", async () => {
      // Arrange
      const { id, createdAt, updatedAt, ...store } = new Store();
      const user = new User();
      mockRequest.body = store;
      mockRequest.user = { id: user.id, email: user.email };

      (StoreServices.create as jest.Mock).mockRejectedValueOnce(userNotFound);

      // Act

      await StoreController.create(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.create).toHaveBeenCalledWith(store, mockRequest.user);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(userNotFound.data);

    });

  });

  describe("get", () => {

    it("should get store successfully", async () => {
      // Arrange
      const store = new Store();
      mockRequest.params = { id: store.id.toString() };

      // Act

      await StoreController.get(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.findStoreById).toHaveBeenCalledWith(store.id.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith(store);

    });

    it("should return a store not found error", async () => {
      // Arrange
      const store = new Store();
      mockRequest.params = { id: store.id.toString() };

      (StoreServices.findStoreById as jest.Mock).mockRejectedValueOnce(storeNotFound);

      // Act

      await StoreController.get(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.findStoreById).toHaveBeenCalledWith(store.id.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(storeNotFound.data);

    });

  });

  describe("getAll", () => {

    it("should get all stores successfully", async () => {
      // Arrange
      const store1 = new Store();
      let store2 = new Store();
      store2.id = 2;
      mockRequest.query = { page: 1, limit: 10 };

      
      mockResponse.header = jest.fn().mockReturnValue({
        'Current-Page': '1',
        'Page-Size': '1',
        'Total-Count': '1',
        'Total-Pages': '1'
      });

      mockResponse.getHeader = jest.fn().mockReturnValue('1');

      // Act

      await StoreController.getAll(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.getAll).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith([ store1, store2 ]);
      expect(mockResponse.getHeader('Current-Page')).toBe('1');
      expect(mockResponse.getHeader('Page-Size')).toBe('1');
      expect(mockResponse.getHeader('Total-Count')).toBe('1');
      expect(mockResponse.getHeader('Total-Pages')).toBe('1');

    });

  });

  describe("delete", () => {
      
    it("should delete store successfully", async () => {
      // Arrange
      const store = new Store();
      mockRequest.params = { id: store.id.toString() };

      // Act

      await StoreController.delete(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.delete).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith({});

    });

    it("should return a store not found error", async () => {
      // Arrange
      const store = new Store();
      mockRequest.params = { id: store.id.toString() };

      (StoreServices.delete as jest.Mock).mockRejectedValueOnce(storeNotFound);

      // Act

      await StoreController.delete(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.delete).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(storeNotFound.data);

    });
  });

  describe("deleteMany", () => {

    it("should delete many stores successfully", async () => {

      // Arrange
      const ids = [ 1, 2 ];
      mockRequest.query = JSON.stringify(ids);

      // Act

      await StoreController.deleteMany(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.deleteMany).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith({});

    });

    it("should return a store not found error", async () => {
        
        // Arrange
        const ids = [ 1, 2 ];
        mockRequest.query = JSON.stringify(ids);
  
        (StoreServices.deleteMany as jest.Mock).mockRejectedValueOnce(storeNotFound);
  
        // Act
  
        await StoreController.deleteMany(mockRequest, mockResponse);
  
        // Assert
        expect(StoreServices.deleteMany).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
        expect(mockResponse.json).toHaveBeenCalledWith(storeNotFound.data);
  
    });


  });

  describe("update", () => {

    it("should update a store successfully", async () => {
      // Arrange
      const store = new Store();
      const storeUpdate = new Store().update();

      mockRequest.params = { id: store.id.toString() };
      mockRequest.body = storeUpdate;
      mockResponse.json = jest.fn().mockReturnValueOnce(storeUpdate);

      // Act

      await StoreController.update(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.update).toHaveBeenCalledWith(mockRequest.params.id, storeUpdate);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith(storeUpdate);

    });

    it("should return a store not found error", async () => {
      // Arrange
      const store = new Store();
      const storeUpdate = new Store();
      mockRequest.params = { id: store.id.toString() };
      mockRequest.body = storeUpdate;

      (StoreServices.update as jest.Mock).mockRejectedValueOnce(storeNotFound);

      // Act

      await StoreController.update(mockRequest, mockResponse);

      // Assert
      expect(StoreServices.update).toHaveBeenCalledWith(mockRequest.params.id, storeUpdate);
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(storeNotFound.data);

    });

  });

});