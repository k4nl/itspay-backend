export class Store {
  public name: string;
  public address: string;
  public logo: string;
  public url: string;
  public id: number;
  public createdAt: Date;
  public updatedAt: Date;
  constructor() {
    this.name = "Store"
    this.address = "Address"
    this.logo = "Logo"
    this.url = "Url"
    this.id = 1
    this.createdAt = new Date('2021/01/01')
    this.updatedAt = new Date('2021/01/01')
  }

  public update() {
    this.name = "Store 1"
    this.address = "Address 1"
    this.logo = "Logo 1"
    this.url = "Url 1"
    this.id = 1
    this.createdAt = new Date('2021/01/01')
    this.updatedAt = new Date('2021/01/01')

    return {
      name: this.name,
      address: this.address,
      logo: this.logo,
      url: this.url,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}