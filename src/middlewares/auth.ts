import { DecodedToken } from './../dtos/users';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import UsersRepositoty from '../repositories/users';

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const [tokenType, accessToken] = authHeader.split(' ');
  if (tokenType !== 'Bearer') {
    return next();
  }

  try {
    res.locals.decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;
    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return next();
      }

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as DecodedToken;

      const user = await UsersRepositoty.getUser(decodedRefreshToken.userId);

      if (!user) {
        return next();
      }

      const payload = user.profileUrl
        ? {
            userId: user.userId,
            username: user.username,
            profileUrl: user.profileUrl,
          }
        : { userId: user.userId, nickname: user.username };

      const newAccessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
      );

      res.json({ newAccessToken });
      return;
    } else {
      return next();
    }
  }
};
