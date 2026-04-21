/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  ICommandHandler,
  IUserRepository,
  LoginUserQuery,
} from '../interface';
import { UserLoginDTOSchema } from '../model/dto';
import { ErrInvalidCredentials } from '../model/error';
import { ModelStatus } from '../../../share/model/base-model';

// Đổi Query thành Command vì bây giờ Đăng nhập CÓ LÀM THAY ĐỔI DB (Lưu Refresh Token)
export interface LoginUserCommand {
  cmd: UserLoginDTOSchema;
}
// 2 Secret Key khác nhau để tăng bảo mật
const JWT_ACCESS_SECRET = 'access_secret_key_123';
const JWT_REFRESH_SECRET = 'refresh_secret_key_123';

// Kiểu dữ liệu trả về
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class LoginUserCmdHandler implements ICommandHandler<
  LoginUserQuery,
  TokenResponse
> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: LoginUserQuery): Promise<TokenResponse> {
    const {
      success,
      data: parseData,
      error,
    } = UserLoginDTOSchema.safeParse(command.cmd);
    if (!success) throw new Error(error.issues[0].message);

    const user = await this.repository.findByCond({ email: parseData.email });
    if (!user || user.status !== ModelStatus.ACTIVE)
      throw ErrInvalidCredentials;

    const isPasswordMatch = await bcrypt.compare(
      parseData.password,
      user.password,
    );
    if (!isPasswordMatch) throw ErrInvalidCredentials;

    // Chỉ đưa những thông tin cần thiết vào Payload
    const payload = { id: user.id, email: user.email };

    // 1. Tạo Access Token (Sống 15 phút)
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    // 2. Tạo Refresh Token (Sống 7 ngày)
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    // 3. Lưu Refresh Token vào Database
    await this.repository.update(user.id, { refresh_token: refreshToken });

    return { accessToken, refreshToken };
  }
}
