export default class CustomError extends Error {
  public status: number;
  public data: any;
  constructor(status: number, data: any) {
    super();
    this.status = status;
    this.data = data;
  }
}