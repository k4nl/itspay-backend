export default interface IRequest {
  body: any,
  params: any,
  query: string,
  user?: any
}