import { LoginRequest, LoginResponse, SignUpRequest } from '../dtos/users';
import UsersRepository from '../repositories/users';

class UsersService {
  signUp = async (user: SignUpRequest) => {
    const newUser = await UsersRepository.signUp(user);
    return newUser;
  };

  login = async (user: LoginRequest) => {
    const result: LoginResponse = await UsersRepository.login(user);
    return result;
  };
}

export default new UsersService();
