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
    this.createdAt = new Date('01/01/2021');
    this.updatedAt = new Date('01/01/2021');
  }
}