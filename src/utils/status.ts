export const statusCode = {
  SUCCESS: 200,
  ERROR: 500,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  CREATED: 201,
  NO_CONTENT: 204,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  BAD_GATEWAY: 502,
}

export interface IStatusCode {
  SUCCESS: number,
  ERROR: number,
  NOT_FOUND: number,
  UNAUTHORIZED: number,
  FORBIDDEN: number,
  BAD_REQUEST: number,
  CREATED: number,
  NO_CONTENT: number,
  CONFLICT: number,
  UNPROCESSABLE_ENTITY: number,
  INTERNAL_SERVER_ERROR: number,
  SERVICE_UNAVAILABLE: number,
  GATEWAY_TIMEOUT: number,
  BAD_GATEWAY: number,
}