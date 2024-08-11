import { HttpStatus } from '@nestjs/common';

export interface MyResponse<T> {
  status: HttpStatus;
  message: string;
  payload?: T;
}
