import CustomError from "../../../utils/CustomError";
import { statusCode } from "../../../utils/status";
import Validate from "../../../utils/validate";


const unauthorized = new CustomError(statusCode.UNAUTHORIZED, 'Unauthorized');
const invalidDate = new CustomError(statusCode.BAD_REQUEST, 'Invalid date');
const invalidEmail = new CustomError(statusCode.BAD_REQUEST, 'Invalid email');
const incorrectIdFormat = new CustomError(statusCode.BAD_REQUEST, 'Invalid Id type, it must be a number');
const incorrectEmailFormat = new CustomError(statusCode.BAD_REQUEST, 'Invalid Email type, it must be a string');
const idIsRequired = new CustomError(statusCode.BAD_REQUEST, 'Id is required');


describe('Validate', () => {

  describe('constructor', () => {
      
    it('should create a new instance of Validate', () => {
      // Arrange
      const type = 'Id';
      const validate = new Validate(type);

      // Assert
      expect(validate).toBeInstanceOf(Validate);
      expect(validate.isRequired).toBe(`${type} is required`);
      expect(validate.isInvalid).toBe(`Invalid ${type} type, it must be`);
    });
  
  });

  describe('required', () => {
      
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = 'test';
      const validate = new Validate('Id');
  
      // Act
      const result = () => validate.required(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';
      const validate = new Validate('Id');
  
      // Act
      const result = () => validate.required(value);
  
      // Assert
      expect(result).toThrow(idIsRequired);
    });
  
  });

  describe('string', () => {

    it('should not throw an error if value is a string', () => {
      // Arrange
      const value = 'test';
      const validate = new Validate('Email');
  
      // Act
      const result = () => validate.string(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is not a string', () => {
      // Arrange
      const value = 1;
      const validate = new Validate('Email');
  
      // Act
      const result = () => validate.string(value as unknown as string);
  
      // Assert
      expect(result).toThrow(incorrectEmailFormat);
    });
  
  });

  describe('number', () => {
      
      it('should not throw an error if value is a number', () => {
        // Arrange
        const value = 1;
        const validate = new Validate('Id');
    
        // Act
        const result = () => validate.number(value);
    
        // Assert
        expect(result).not.toThrow();
      });
  
      it('should throw an error if value is not a number', () => {
        // Arrange
        const value = 'test';
        const validate = new Validate('Id');
    
        // Act
        const result = () => validate.number(value as unknown as number);
    
        // Assert
        expect(result).toThrow(incorrectIdFormat);
      });
    
  });

  describe('email', () => {
        
    it('should not throw an error if value is a valid email', () => {
      // Arrange
      const value = 'gustavo@email.com';
      const validate = new Validate('Email');
      const result = () => validate.string(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is not a valid email', () => {
      // Arrange
      const value = 'test';
      const validate = new Validate('Email');
  
      // Act
      const result = () => validate.email(value);
  
      // Assert
      expect(result).toThrow(invalidEmail);
    });

  });

  describe('timestamp', () => {

    it('should not throw an error if value is a valid date', () => {
      // Arrange
      const value = '01-01-2021';
      const validate = new Validate('Date');
  
      // Act
      const result = () => validate.timestamp(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is not a valid date', () => {
      // Arrange
      const value = 'test';
      const validate = new Validate('Date');
  
      // Act
      const result = () => validate.timestamp(value);
  
      // Assert
      expect(result).toThrow(invalidDate);
    });

  });

  describe('token', () => {
      
      it('should not throw an error if value is a valid token', () => {
        // Arrange
        const value = true;
    
        // Act
        const result = () => Validate.token(value);
    
        // Assert
        expect(result).not.toThrow();
      });
  
      it('should throw an error if value is not a valid token', () => {
        // Arrange
        const value = false;    
        // Act
        const result = () => Validate.token(value);
    
        // Assert
        expect(result).toThrow(unauthorized);
      });

  });

  describe('user', () => {

    it('should not throw an error if value is a valid user', () => {
      // Arrange
      const value = true;
  
      // Act
      const result = () => Validate.user(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is not a valid user', () => {
      // Arrange
      const value = false;    
      // Act
      const result = () => Validate.user(value);
  
      // Assert
      expect(result).toThrow(unauthorized);
    });
  });

  describe('headers', () => {

    it('should not throw an error if value is a valid header', () => {
      // Arrange
      const value = { authorization: 'some token' }; 
      // Act
      const result = () => Validate.headers(value);
  
      // Assert
      expect(result).not.toThrow();

    });

    it('should throw an error if value is missing on header', () => {
      // Arrange
      const value = { }; 
      // Act
      const result = () => Validate.headers(value);
  
      // Assert
      expect(result).toThrow(unauthorized);

    });
  });

});