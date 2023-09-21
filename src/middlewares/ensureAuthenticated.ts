import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!res.locals.decoded) {
    throw new CustomError(403, '로그인이 필요한 기능입니다.');
  }
  next();
};
