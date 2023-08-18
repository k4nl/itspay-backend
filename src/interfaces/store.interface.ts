export interface IStoreCreate {
  name: string,
  address: string,
  logo: string,
  url: string,
  owner: number
}

export interface IStoreUpdate {
  name?: string,
  address?: string,
  logo?: string,
  url?: string
}

export interface IStoreFilter {
  name?: string,
  address?: string,
  logo?: string,
  url?: string,
  createdAt?: string,
  updatedAt?: string,
  page?: string,
  limit?: string,
  owner?: string,
  createdBy?: string
}
