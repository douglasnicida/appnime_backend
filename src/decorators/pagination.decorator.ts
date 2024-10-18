import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface Pagination {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: {field: string, by: "ASC" | "DESC"}[];
  search?: {field: string, value: string}[];
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
    sort: [],
    search: []
  }

  paginationParams.offset = req.query.offset ? parseInt(req.query.offset.toString()) : 0;
  paginationParams.limit = req.query.limit ? parseInt(req.query.limit.toString()) : 0;
  paginationParams.page = req.query.page ? parseInt(req.query.page.toString()) : 0;

  if(req.query.sort) {
    const sortArray = req.query.sort.toString().split(',');

    paginationParams.sort = sortArray.map(sortItem => {
      const sortBy = sortItem[0]

      switch(sortBy) {
        case "-":
        case "+":
          return{
            field:sortItem.slice(1),
            by:'ASC'
          }
        default: 
        return {
          field: sortItem.trim(),
          by: 'DESC'
        }
      }
    })
  }

  if(req.query.search) {
    const searchArray = req.query.search.toString().split(',');
    paginationParams.search = searchArray.map(searchItem => {
      const field = searchItem.split(":")[0];
      const value = searchItem.split(":")[1];

      return {
        field,
        value
      }
    })
  }

  return paginationParams;

})