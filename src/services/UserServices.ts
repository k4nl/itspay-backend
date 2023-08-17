// import User from "database/models/User";
import CustomError from "../utils/CustomError";
import { IUserCreate } from "interfaces/user-create.interface";

class UserService {
  static async create(data: IUserCreate) {
    return 'user created';
  }
}

export default UserService;