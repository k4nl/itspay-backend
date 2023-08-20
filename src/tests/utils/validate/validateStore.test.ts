import CustomError from "../../../utils/CustomError";
import { statusCode } from "../../../utils/status";
import ValidateStore from "../../../utils/validate/ValidateStore";
import { Store } from "../../mocks/store.mock"
import { IStoreCreate } from "../../../interfaces/store.interface";


const unauthorized = new CustomError(statusCode.UNAUTHORIZED, 'Unauthorized');
const invalidEmail = new CustomError(statusCode.BAD_REQUEST, 'Invalid field Email');
const incorrectEmailFormat = new CustomError(statusCode.BAD_REQUEST, 'Email must be a string');
const incorrectIdFormat = new CustomError(statusCode.BAD_REQUEST, 'Id must be a number');
const idIsRequired = new CustomError(statusCode.BAD_REQUEST, 'Id is required');
const noData = new CustomError(statusCode.BAD_REQUEST, 'No data to update');
const storeNotFound = new CustomError(statusCode.NOT_FOUND, 'Store not found');
const errorCreatingStore = new CustomError(statusCode.INTERNAL_SERVER_ERROR, 'Error creating store');
const repeatedStore = new CustomError( statusCode.BAD_REQUEST,`Store 1 is repeated`);
const storeOneNotFound = new CustomError( statusCode.NOT_FOUND,`Store 1 not found`);

describe('ValidateStore', () => {
  
  describe('empty', () => {
        
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = {name: 'test'};
  
      // Act
      const result = () => ValidateStore.empty(value);
  
      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = {};
  
      // Act
      const result = () => ValidateStore.empty(value);
  
      // Assert
      expect(result).toThrow(noData);
    });
    
  });

  describe('storeName', () => {
          
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = 'test';

      // Act
      const result = () => ValidateStore.storeName(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';

      // Act
      const result = () => ValidateStore.storeName(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });
    
  });

  describe('adress', () => {
            
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = 'test';

      // Act
      const result = () => ValidateStore.adress(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';

      // Act
      const result = () => ValidateStore.adress(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });
      
  });

  describe('logo', () => {
                
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = 'test';

      // Act
      const result = () => ValidateStore.logo(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';

      // Act
      const result = () => ValidateStore.logo(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });
          
  });

  describe('url', () => {
                    
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = 'test';

      // Act
      const result = () => ValidateStore.url(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';

      // Act
      const result = () => ValidateStore.url(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });
              
  });

  describe('id', () => {
                        
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = '1';

      // Act
      const result = () => ValidateStore.id(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';

      // Act
      const result = () => ValidateStore.id(value);

      // Assert
      expect(result).toThrow(idIsRequired);
    });

    it('should throw an error if value is not a number', () => {
      // Arrange
      const value = 'a';

      // Act
      const result = () => ValidateStore.id(value);

      // Assert
      expect(result).toThrow(incorrectIdFormat);
    });
                  
  });

  describe('found', () => {
                            
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = new Store();

      // Act
      const result = () => ValidateStore.found(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = new Store();

      // Act
      const result = () => ValidateStore.found(null as unknown as Store);

      // Assert
      expect(result).toThrow(storeNotFound);
    });

  });

  describe('validateStoreUpdate', () => {
                                
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const { name, address, logo, url, } = new Store();

      // Act
      const result = () => ValidateStore.validateStoreUpdate({ name, address, logo, url, owner: 1 });

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = {};

      // Act
      const result = () => ValidateStore.validateStoreUpdate(value);

      // Assert
      expect(result).toThrow(noData);
    });

    it('should throw an error if value has an invalid field', () => {
      // Arrange
      const value = {name: 'test', address: 'test', logo: 'test', url: 'test', owner: 1, test: 'test'};

      // Act
      const result = () => ValidateStore.validateStoreUpdate(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });

    it('should throw an error if value has an invalid field', () => {
      // Arrange
      const value = {name: 'test', address: 'test', logo: 'test', url: 'test', owner: 1, test: 'test'};

      // Act
      const result = () => ValidateStore.validateStoreUpdate(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });

    it('should throw an error if value has an invalid field', () => {
      // Arrange
      const value = {name: 'test', address: 'test', logo: 'test', url: 'test', owner: 1, test: 'test'};

      // Act
      const result = () => ValidateStore.validateStoreUpdate(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });

    it('should throw an error if value has an invalid field', () => {
      // Arrange
      const value = {name: 'test', address: 'test', logo: 'test', url: 'test', owner: 1, test: 'test'};

      // Act
      const result = () => ValidateStore.validateStoreUpdate(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });

    it('should throw an error if value has an invalid field', () => {
      // Arrange
      const value = {name: 'test', address: 'test', logo: 'test', url: 'test', owner: 1, test: 'test'};

      // Act
      const result = () => ValidateStore.validateStoreUpdate(value);

      // Assert
      expect(result).toThrow(invalidEmail);
    });
  });

  describe('validateStore', () => {

    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = new Store();

      // Act
      const result = () => ValidateStore.validateStore({ ...value, owner: 1 });

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = {};

      // Act
      const result = () => ValidateStore.validateStore(value as unknown as IStoreCreate);

      // Assert
      expect(result).toThrow(noData);
    });

    it('should throw an error if value has an invalid field', () => {
      // Arrange
      const value = {name: 'test', address: 'test', logo: 123, url: 'test', owner: 1 };

      // Act
      const result = () => ValidateStore.validateStore(value as unknown as IStoreCreate);

      // Assert
      expect(result).toThrow(invalidEmail);
    });

  });

  describe('response', () => {
    
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = new Store();

      // Act
      const result = () => ValidateStore.response(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = null;

      // Act
      const result = () => ValidateStore.response(value);

      // Assert
      expect(result).toThrow(storeNotFound);
    });

  });

  describe('storesId', () => {
      
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const value = JSON.stringify([1,2]);

      // Act
      const result = () => ValidateStore.storesId(value);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const value = '';

      // Act
      const result = () => ValidateStore.storesId(value);

      // Assert
      expect(result).toThrow(idIsRequired);
    });

    it('should throw an error if value is not a number', () => {
      // Arrange
      const value = JSON.stringify([1, 'a']);

      // Act
      const result = () => ValidateStore.storesId(value);

      // Assert
      expect(result).toThrow(incorrectIdFormat);
    });
  
  });

  describe('allStoresFound', () => {
          
    it('should not throw an error if value is not empty', () => {
      // Arrange
      const store1 = new Store();
      const store2 = new Store();

      // Act
      const result = () => ValidateStore.allStoresFound([{ id: store1.id }], [store2.id]);

      // Assert
      expect(result).not.toThrow();
    });

    it('should throw an error if value is empty', () => {
      // Arrange
      const stores = [];
      const ids = []

      // Act
      const result = () => ValidateStore.allStoresFound(stores, ids);

      // Assert
      expect(result).toThrow(storeNotFound);
    });

    it('should throw an error if some store is not found', () => {
      // Arrange
      const store1 = new Store();
      const store2 = new Store();
      const stores = [{ id: store1.id + 1 }];
      const ids = [store2.id];

      // Act
      const result = () => ValidateStore.allStoresFound(stores, ids);

      // Assert
      expect(result).toThrow(storeOneNotFound);
    });
  })



});

