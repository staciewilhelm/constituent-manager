import { Params, Query, Send } from 'express-serve-static-core';

export interface ITypedRequest<T extends Params, U extends Query> extends Express.Request {
  params: T,
  query: U
}

export interface ITypedRequestBody<T> extends Express.Request {
  body: T
}
