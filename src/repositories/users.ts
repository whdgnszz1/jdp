import { LoginRequest, SignUpRequest } from '../dtos/users';
import { CustomError } from '../errors/customError';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';

class UsersRepository {
  signUp = async (user: SignUpRequest) => {
    const existEmail = await prisma.users.findFirst({
      where: { email: user.email },
    });
    if (existEmail) {
      throw new CustomError(412, '이미 존재하는 이메일입니다.');
    }

    const existUsername = await prisma.users.findFirst({
      where: { username: user.username },
    });
    if (existUsername) {
      throw new CustomError(412, '중복된 닉네임입니다.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await prisma.users.create({
      data: {
        email: user.email,
        nickname: user.nickname,
        username: user.username,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    return { message: '회원가입에 성공하였습니다.' };
  };

  login = async (user: LoginRequest): Promise<Express.User> => {
    const existUser: Express.User | null = await prisma.users.findFirst({
      where: { username: user.username },
      select: {
        userId: true,
        username: true,
        password: true,
      },
    });

    if (!existUser) {
      throw new CustomError(412, '닉네임 또는 패스워드를 확인해주세요.');
    }
    if (existUser.password) {
      const validatePassword: boolean = await bcrypt.compare(
        user.password,
        existUser.password,
      );
      if (validatePassword) {
        delete existUser.password;
        return existUser;
      } else {
        throw new CustomError(412, '닉네임 또는 패스워드를 확인해주세요');
      }
    }
    delete existUser.password;
    return existUser;
  };

  getUser = async (userId: number) => {
    const existUser: Express.User | null = await prisma.users.findFirst({
      where: { userId },
    });
    return existUser;
  };
}

export default new UsersRepository();
