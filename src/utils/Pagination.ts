import { IPagination, IPaginationResponse } from "interfaces/pagination.interface";
import { Response } from "express";
import Validate from "./validate";

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

  static createPaginationResponse({ limit, total, page, pageSize }: IPaginationResponse, res: Response): void {
    const totalPages = Math.ceil(total / limit);
    res.header('Current-Page', page.toString());
    res.header('Page-Size', pageSize.toString());
    res.header('Total-Count', total.toString());
    res.header('Total-Pages', totalPages.toString());
  }
}