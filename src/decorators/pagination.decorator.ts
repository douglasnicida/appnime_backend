import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { Request } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export type Paginated<T> = {
  total: number;
  items: T[];
  page: number;
  size: number;
};

export const PaginationParams = createParamDecorator(
  (_data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = Number(req.query.page as string);
    const size = Number(req.query.size as string);

    const MAX_SIZE = 10;

    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
      throw new BadRequestException('Os dados de paginação são inválidos');
    }

    if (size > MAX_SIZE) {
      throw new BadRequestException(
        `Uma página deve ter no máximo ${MAX_SIZE} elementos.`,
      );
    }

    const limit = size;
    const offset = page * limit;

    return { page, limit, size, offset };
  },
);
