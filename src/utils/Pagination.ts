import { IPagination } from "interfaces/pagination.interface";
import Validate from "./Validate";

export default class Pagination {
  public defaultPagination = {
    limit: 20,
    offset: 0,
  }

  static getOffset(page: number, limit: number) {
    return (page - 1) * limit;
  }

  static getLimit(limit: number) {
    const validate = new Validate('Limit');
    validate.number(Number(limit));
    return Number(limit);
  }

  static handlePage(pagination: IPagination) {
    const defaultPagination = new Pagination().defaultPagination;
    if (pagination.limit) {
      defaultPagination.limit = this.getLimit(pagination.limit);
    }
    if (pagination.page) {
      defaultPagination.offset = this.getOffset(pagination.page, defaultPagination.limit);
    }
    return defaultPagination;
  }
}