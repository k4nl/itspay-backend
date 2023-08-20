import Validate from "../../utils/validate/ValidateStore";
import { Response, NextFunction } from "express";
import IRequest from "../../interfaces/request.interface";
import StoreMiddleware from "../../middleware/StoreMiddleware";
import { Store } from "../mocks/store.mock";
import CustomError from "../../utils/CustomError";
import { statusCode } from "../../utils/status";

let mockRequest = {} as IRequest;
let mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  header: jest.fn(),
} as unknown as Response;
let mockNext = jest.fn() as NextFunction;

const constructError = (message: string) => new CustomError(statusCode.BAD_REQUEST, message);

jest.mock("../../utils/validate/ValidateStore", () => ({
  validateStore: jest.fn().mockImplementation(() => {}),
  id: jest.fn().mockImplementation(() => {}),
  validateStoreUpdate: jest.fn().mockImplementation(() => {}),
  storesId: jest.fn().mockImplementation(() => {}),
}));

describe("Store Middleware", () => {

  beforeEach(() => {
    mockRequest = {} as IRequest;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      header: jest.fn()
    } as unknown as Response;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {

    it("should call next", async () => {
        // Arrange
        const user = new Store();
        const { id, createdAt, updatedAt, ...store } = new Store();
        mockRequest.user = { id: user.id };
        mockRequest.body = { ...store, owner: user.id };
  
        // Act
        await StoreMiddleware.create(mockRequest, mockResponse, mockNext);
  
        // Assert
        expect(Validate.validateStore).toHaveBeenCalledWith(mockRequest.body);
        expect(mockNext).toHaveBeenCalled();
    });

    it("should return a error if store is not valid", async () => {
      // Arrange
      const nameIsRequiredError = constructError('Name is required');

      (Validate.validateStore as jest.Mock).mockImplementationOnce(() => {
        throw nameIsRequiredError;
      });

      // Act
      await StoreMiddleware.create(mockRequest, mockResponse, mockNext);

      // Assert
      expect(Validate.validateStore).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(nameIsRequiredError.status);
      expect(mockResponse.json).toHaveBeenCalledWith(nameIsRequiredError.data);
    });

  });

  describe("findStoreById", () => {

    it("should call next", async () => {
      // Arrange
      const store = new Store();
      mockRequest.params = { id: store.id.toString() };
  
      // Act
      await StoreMiddleware.findStoreById(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(Validate.id).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return a error if id is invalid", async () => {
      // Arrange
      const error = constructError('Id is invalid');
      mockRequest.params = { id: '1' };

      (Validate.id as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
  
      // Act
      await StoreMiddleware.findStoreById(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(Validate.id).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(error.status);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });
  
  });
  
  describe("update", () => {
  
    it("should call next", async () => {
      // Arrange
      mockRequest.params = { id: 1 };
      mockRequest.body = new Store();
  
      // Act
      await StoreMiddleware.update(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(Validate.id).toHaveBeenCalledWith(mockRequest.params.id);
      expect(Validate.validateStoreUpdate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockNext).toHaveBeenCalled();
    });
  
    it("should return a error if id is invalid", async () => {
      // Arrange
      const error = constructError('Id is invalid');
      mockRequest.params = { id: 'a' };

      (Validate.id as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
  
      // Act
      await StoreMiddleware.update(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(Validate.id).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(error.status);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });

  });

  describe("delete", () => {
  
    it("should call next", async () => {
      // Arrange
      mockRequest.params = { id: 1 };
  
      // Act
      await StoreMiddleware.delete(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(Validate.id).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return a error if id is invalid", async () => {
      // Arrange
      const error = constructError('Id is invalid');
      mockRequest.params = { id: 'a' };

      (Validate.id as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
  
      // Act
      await StoreMiddleware.delete(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(Validate.id).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(error.status);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });
  
  
  })
  
  describe("deleteMany", () => {
  
    it("should call next", async () => {
      // Arrange
      const ids = [1, 2];
      mockRequest.query = { ids: JSON.stringify(ids)};
  
      // Act
  
      await StoreMiddleware.deleteMany(mockRequest, mockResponse, mockNext);
  
  
      // Assert
      expect(Validate.storesId).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return an error if invalid id", async () => {
      // Arrange
      const ids = [1, 'a'];
      mockRequest.query = { ids: JSON.stringify(ids)};

      const error = constructError('Id is invalid');

      (Validate.storesId as jest.Mock).mockImplementationOnce(() => { throw error });
  
      // Act
  
      await StoreMiddleware.deleteMany(mockRequest, mockResponse, mockNext);
  
  
      // Assert
      expect(Validate.storesId).toHaveBeenCalledWith(mockRequest.query.ids);
      expect(mockResponse.status).toHaveBeenCalledWith(error.status);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });

    it("should return an error if some id is repeated", async () => {
      // Arrange
      const ids = [1, 1];
      mockRequest.query = { ids: JSON.stringify(ids)};

      const error = constructError('Store 1 is repeated');

      (Validate.storesId as jest.Mock).mockImplementationOnce(() => { throw error });
  
      // Act
  
      await StoreMiddleware.deleteMany(mockRequest, mockResponse, mockNext);
  
  
      // Assert
      expect(Validate.storesId).toHaveBeenCalledWith(mockRequest.query.ids);
      expect(mockResponse.status).toHaveBeenCalledWith(error.status);
      expect(mockResponse.json).toHaveBeenCalledWith(error.data);
    });
  })
});