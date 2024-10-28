import { HttpStatus } from '@nestjs/common';

export interface MyResponse<T> {
  status: HttpStatus;
  message: string;
  payload?: T;
}

export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string;
}

export enum OrderByTypes {
  ASC = 'asc',
  DESC = 'desc'
}