export class User {
  public name: string;
  public email: string;
  public id: number;
  public token: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor() {
    this.name = "Gustavo"
    this.email = "gustavo@email.com"
    this.id = 1
    this.token = "token"
    this.password = "123456"
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}


export const userMocks = {
  findByUniqueKey: jest.fn().mockResolvedValue({
    id: 1,
    email: "gustavo@email.com"
  }),
  create: jest.fn().mockResolvedValue({
    id: 1,
    name: "Gustavo",
    email: "gustavo@email.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    token: 'token'
  }),
  update: jest.fn().mockResolvedValue({
    id: 1,
    name: "Gustavo",
    email: "gustavo@email.com",
  }),
  delete: jest.fn().mockResolvedValue({}),
  login: jest.fn().mockResolvedValue({
    id: 1,
    name: "Gustavo",
    email: "gustavo@email.com",
    token: 'token'
  }),
  getAll: jest.fn().mockResolvedValue({
    response: [
      {
        id: 1,
        name: "Gustavo",
        email: "gustavo@email.com",
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      pageSize: 1,
      total: 1
    }
  }),
};