export interface IPagination {
  page?: number;
  limit?: number;
}

export interface IPaginationResponse {
  limit: number,
  total: number,
  page: number,
  pageSize: number
}