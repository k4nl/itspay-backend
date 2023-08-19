import { User } from "../mocks/user.mock"
import jwt from "jsonwebtoken";
import { Response } from "express";
import { statusCode } from "../../utils/status";
import UserServices from "../../services/UserServices";
import IRequest from "../../interfaces/request.interface";
import CustomError from "../../utils/CustomError";
import Auth from "../../middleware/Auth";
require("dotenv").config();

let mockRequest = {} as IRequest;
let mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  header: jest.fn(),
} as unknown as Response;
let mockNext = jest.fn();

const unauthorized = new CustomError(statusCode.UNAUTHORIZED, "Unauthorized");
const SECRET_KEY = 'secret_key'
const jwtOptions = { expiresIn: "24h" }


jest.mock("../../services/UserServices", () => ({
  findByUniqueKey: jest.fn().mockResolvedValue({
    id: 1,
    name: "User",
    email: "user@email.com"
  }),
}));

describe("Auth Middleware", () => {

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

  describe("createToken", () => {

    it("should return a token", () => {

      const user = new User();
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, jwtOptions);

      Auth.createToken(user);

      expect(token).toEqual(expect.any(String));
    });

  });

  describe("validateToken", () => {

    it("should set request user with a user data from token", async () => {

      const user = new User();
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, jwtOptions);
      const verifyed = jwt.verify(token, SECRET_KEY);
      mockRequest.headers = { authorization: token };
      mockRequest.user = verifyed;

      await Auth.validateToken(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toEqual(verifyed);

    });

    it("should return a unauthorized error if authorization is not present on headers", async () => {

      await Auth.validateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith(unauthorized.data);

    });

    it("should return a unauthorized error if token is invalid", async () => {

      const user = new User();
      const token = jwt.sign({ id: user.id, email: user.email }, "WRONG SECRET", jwtOptions);
      mockRequest.headers = { authorization: token };

      await Auth.validateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith(unauthorized.data);

    });

    it("should return a unauthorized error if user is not in database", async () => {

      (UserServices.findByUniqueKey as jest.Mock).mockRejectedValueOnce(unauthorized);

      await Auth.validateToken(mockRequest, mockResponse, mockNext);


      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith(unauthorized.data);

    });

  });

});
