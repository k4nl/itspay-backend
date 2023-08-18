import { Request } from "express"

export default interface IRequest extends Request{
  body: any,
  params: any,
  query: any,
  user?: any
}