import CustomError from "../../../utils/CustomError";
import { statusCode } from "../../../utils/status";
import ValidateUser from "../../../utils/validate/ValidateUser";
import { User } from "../../mocks/user.mock"
import { IUserCreate } from "../../../interfaces/user.interface";

const storeNotFound = new CustomError(statusCode.NOT_FOUND, 'User 1 not found');
const wrongPassword = new CustomError(statusCode.BAD_REQUEST, 'Password must be at least 3 characters');
const wrongName = new CustomError(statusCode.BAD_REQUEST, 'Name must be at least 3 characters');
const userAlreadyExists = new CustomError(statusCode.BAD_REQUEST, 'User already exists');
const wrongKey = new CustomError(statusCode.BAD_REQUEST, 'Key must have id or email');
const user = new User();
const wrongEmail = 'wrongemail';

describe('ValidateUser', () => {

  describe('email', () => {
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = user.email;
  
      // Act
      const result = () => ValidateUser.email(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = ''
  
      // Act
      const result = () => ValidateUser.email(value);
  
      // Assert
      expect(result).toThrow();
    });

    it('should throw an error if value is not a string', () => {
      // Arrange
      const value = 123
  
      // Act
      const result = () => ValidateUser.email(value as any);
  
      // Assert
      expect(result).toThrow();
    });

  });

  describe('password', () => {
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = '123'
  
      // Act
      const result = () => ValidateUser.password(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = ''
  
      // Act
      const result = () => ValidateUser.password(value);
  
      // Assert
      expect(result).toThrow();
    });

    it('should throw an error if value is not a string', () => {
      // Arrange
      const value = 123
  
      // Act
      const result = () => ValidateUser.password(value as any);
  
      // Assert
      expect(result).toThrow();
    });

    it('should throw an error if value is less than 3 characters', () => {
      // Arrange
      const value = '12'
  
      // Act
      const result = () => ValidateUser.password(value);
  
      // Assert
      expect(result).toThrow();
    });
  });

  describe('userName', () => {
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = 'Gustavo'
  
      // Act
      const result = () => ValidateUser.userName(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = ''
  
      // Act
      const result = () => ValidateUser.userName(value);
  
      // Assert
      expect(result).toThrow();
    });

    it('should throw an error if value is not a string', () => {
      // Arrange
      const value = 123
  
      // Act
      const result = () => ValidateUser.userName(value as any);
  
      // Assert
      expect(result).toThrow();
    });

    it('should throw an error if value is less than 3 characters', () => {
      // Arrange
      const value = '12'
  
      // Act
      const result = () => ValidateUser.userName(value);
  
      // Assert
      expect(result).toThrow();
    });
  });

  describe('userCreateData', () => {
    it('should not throw an error if data is valid', () => {
      // Arrange
      const data: IUserCreate = {
        email: user.email,
        password: '123',
        name: 'Gustavo',
      };

      // Act
      const result = () => ValidateUser.userCreateData(data);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if email is invalid', () => {
      // Arrange
      const data: IUserCreate = {
        email: wrongEmail,
        password: '123',
        name: 'Gustavo',
      };

      // Act
      const result = () => ValidateUser.userCreateData(data);

      // Assert
      expect(result).toThrow();
    });

    it('should throw an error if name is invalid', () => {
      // Arrange
      const data: IUserCreate = {
        email: user.email,
        password: '123',
        name: '1',
      };

      // Act
      const result = () => ValidateUser.userCreateData(data);

      // Assert
      expect(result).toThrow(wrongName);
    });

    it('should throw an error if password is invalid', () => {
      // Arrange
      const data: IUserCreate = {
        email: user.email,
        password: '12',
        name: 'Gustavo',
      };

      // Act
      const result = () => ValidateUser.userCreateData(data);

      // Assert
      expect(result).toThrow(wrongPassword);
    });

  });

  describe('loginData', () => {

    it('should not throw an error if data is valid', () => {
      // Arrange

      const data = { email: user.email, password: user.password };

      // Act

      const result = () => ValidateUser.loginData(data);

      // Assert

      expect(result).not.toThrow();

    });

    it('should throw an error if email is invalid', () => {
      // Arrange

      const data = { email: wrongEmail, password: user.password };

      // Act

      const result = () => ValidateUser.loginData(data);

      // Assert

      expect(result).toThrow();

    });

    it('should throw an error if password is invalid', () => {
      // Arrange

      const data = { email: user.email, password: '12' };

      // Act

      const result = () => ValidateUser.loginData(data);

      // Assert

      expect(result).toThrow();

    });
  });

  describe('userUpdateData', () => {
      
    it('should not throw an error if data is valid', () => {
      // Arrange

      const data = { name: user.name, password: user.password };

      // Act

      const result = () => ValidateUser.userUpdateData(data);

      // Assert

      expect(result).not.toThrow();

    });

    it('should throw an error if name is invalid', () => {
      // Arrange

      const data = { name: '1', password: user.password };

      // Act

      const result = () => ValidateUser.userUpdateData(data);

      // Assert

      expect(result).toThrow(wrongName);

    });

    it('should throw an error if password is invalid', () => {
      // Arrange

      const data = { name: user.name, password: '12' };

      // Act

      const result = () => ValidateUser.userUpdateData(data);

      // Assert

      expect(result).toThrow(wrongPassword);

    });
  });

  describe('userAlreadyExists', () => {
    it('should throw an error if user already exists', () => {
      // Arrange
      const user = new User();
  
      // Act
      const result = () => ValidateUser.userAlreadyExists(user);
  
      // Assert
      expect(result).toThrow(userAlreadyExists);
    });
    it('should not throw an error if user not exists', () => {
      // Arrange
      const user = null;
  
      // Act
      const result = () => ValidateUser.userAlreadyExists(user);
  
      // Assert
      expect(result).not.toThrow();
    });
  });

  describe('userNotFound', () => {
    it('should throw an error if user not found', () => {
      // Arrange
      const user = null;
  
      // Act
      const result = () => ValidateUser.userNotFound(user, '1');
  
      // Assert
      expect(result).toThrow(storeNotFound);
    });

    it('should not throw an error if user exists', () => {
      // Arrange
      const user = new User();
  
      // Act
      const result = () => ValidateUser.userNotFound(user, '1');
  
      // Assert
      expect(result).not.toThrow();
    });
  });

  describe('uniqueKey', () => {
    it('should throw an error if key is invalid', () => {
      // Arrange
      const key = { id: 0, email: '' };
  
      // Act
      const result = () => ValidateUser.uniqueKey(key);
  
      // Assert
      expect(result).toThrow(wrongKey);
    });

    it('should not throw an error if key is valid', () => {
      // Arrange
      const key = { id: 1, email: user.email };
  
      // Act
      const result = () => ValidateUser.uniqueKey(key);
  
      // Assert
      expect(result).not.toThrow();
    });
  });

});