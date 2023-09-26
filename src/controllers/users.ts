import { Request, Response, CookieOptions } from 'express';
import { LoginRequest, LoginResponse, SignUpRequest } from '../dtos/users';
import UsersService from '../services/users';
import jwt from 'jsonwebtoken';
import asyncHandler from '../lib/asyncHandler';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const user: SignUpRequest = req.body;
  const result = await UsersService.signUp(user);
  console.log(result);
  res.status(200).send({ message: '회원 가입에 성공하였습니다.' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    return res.status(400).send({ message: '로그인에 실패하였습니다.' });
  }

  const user: LoginRequest = req.body;
  const loggedInUser: LoginResponse = await UsersService.login(user);

  const accessToken = jwt.sign(loggedInUser, process.env.ACCESS_SECRET_KEY!, {
    expiresIn: '15d',
  });

  const refreshToken = jwt.sign(
    {
      userId: loggedInUser.userId,
    },
    process.env.REFRESH_SECRET_KEY!,
    {
      expiresIn: '15d',
    },
  );

  const cookieOptions: CookieOptions = {
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  res
    .status(200)
    .send({ token: accessToken, refreshToken, user: loggedInUser });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).send({ message: '로그아웃에 성공하였습니다.' });
});

export const getUserTests = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId: number = res.locals.decoded.userId!;

      const userTests = await prisma.testers.findMany({
        where: {
          userId: userId,
        },
        select: {
          testerId: true,
          title: true,
          content: true,
        },
      });

      res.status(200).json(userTests);
    } catch (error) {
      console.error(error);
      throw new Error('Could not retrieve the tests for the user');
    }
  },
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId: number = res.locals.decoded.userId!;

  const updateData = req.body;

  try {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    const updatedUser = await prisma.users.update({
      where: { userId: userId },
      data: {
        password: hashedPassword,
        email: updateData.email,
      },
    });
    res
      .status(200)
      .json({ message: '회원정보 수정에 성공하였습니다.', data: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error });
  }
});

export const getUserLikeTests = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId: number = res.locals.decoded.userId!;

      const likedTests = await prisma.likes.findMany({
        where: {
          userId: userId,
        },
        select: {
          tester: {
            select: {
              testerId: true,
              title: true,
              content: true,
            },
          },
        },
      });

      // 변환하여 plain test 객체들만 반환
      const result = likedTests.map((lt) => lt.tester);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

export const getUserParticipatedTests = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId: number = res.locals.decoded.userId!;

      const participatedResults = await prisma.results.findMany({
        where: {
          userId: userId,
        },
        include: {
          tester: true,
        },
      });

      const participatedTests = participatedResults.map(
        (result) => result.tester,
      );

      res.status(200).json(participatedTests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  },
);

// export const editProfile = asyncHandler(
//   async (req: Request, res: Response) => {
//     const user = res.locals.decoded;
//     const newUsername = req.body.username;

//     const existingUserWithNickname = await prisma.users.findFirst({
//       where: { username: newUsername },
//     });

//     if (
//       existingUserWithNickname &&
//       existingUserWithNickname.userId !== user.userId
//     ) {
//       return res.status(400).json({
//         message: '이미 사용중인 닉네임입니다.',
//       });
//     }

//     if (req.file) {
//       const profileUrl = req.file.location;
//       const result = await prisma.users.update({
//         where: { userId: user.userId },
//         data: {
//           profileUrl,
//           nickname: newNickname,
//         },
//       });

//       res.status(200).json({
//         message: '회원 정보를 수정하였습니다.',
//         userId: result.userId,
//         nickname: result.nickname,
//         profileUrl: result.profileUrl,
//       });
//     } else {
//       const result = await prisma.users.update({
//         where: { userId: user.userId },
//         data: {
//           nickname: newNickname,
//         },
//       });

//       res.status(200).json({
//         message: '회원 정보를 수정하였습니다.',
//         userId: result.userId,
//         nickname: result.nickname,
//         profileUrl: result.profileUrl,
//       });
//     }
//   },
// );

export const getUserFromToken = (res: Response) => ({
  nickname: res.locals.decoded.nickname,
  userId: res.locals.decoded.userId,
});
