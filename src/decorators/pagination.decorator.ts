import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface Pagination {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  search?: string;
}

// export type PaginateOptions = { page?: number | string, perPage?: number | string }
// export type PaginateFunction = <T, K>(model: any, args?: K, options?: PaginateOptions) => Promise<PaginatedResult<T>>

export class PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export const GetPagination = createParamDecorator((data, ctx: ExecutionContext) : Pagination => {
  const req : Request = ctx.switchToHttp().getRequest();

  const paginationParams : Pagination = {
    offset: 0,
    limit: 10,
    page: 0,
    sort: "",
    search: ""
  }

  paginationParams.offset = req.query.offset ? parseInt(req.query.offset.toString()) : 0;
  paginationParams.limit = req.query.limit ? parseInt(req.query.limit.toString()) : 0;
  paginationParams.page = req.query.page ? parseInt(req.query.page.toString()) : 0;

  if(req.query.sort) {
    paginationParams.sort = req.query.sort.toString()
  }

  if(req.query.search) {
    paginationParams.search = req.query.search.toString()
  }

  return paginationParams;

})