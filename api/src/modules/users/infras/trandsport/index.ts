/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { CreateUserCommand, ICommandHandler, IQueryHandler, LoginUserQuery } from '../../interface';
import { UserCreatedDTOSchema, UserLoginDTOSchema } from '../../model/dto';
import { LoginUserCommand, TokenResponse } from '../../usecare/login-user';

export class UserHttpService {
  [x: string]: any;
  constructor(
    private readonly createCmdHandler: ICommandHandler<
      CreateUserCommand,
      string
    >,
    private readonly loginCmdHandler: ICommandHandler<
      LoginUserCommand,
      TokenResponse
    >,
  ) {}

  // API Đăng ký
  async registerAPI(req: Request, res: Response) {
    const { success, data, error } = UserCreatedDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error.issues[0].message });
      return;
    }

    try {
      const cmd: CreateUserCommand = { cmd: req.body };
      const newUserId = await this.createCmdHandler.execute(cmd);

      // Trả về thành công
      res.status(201).json({
        message: 'Đăng ký thành công',
        data: { id: newUserId },
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async loginAPI(req: Request, res: Response) {
    const { success, error } = UserLoginDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error.issues[0].message });
      return;
    }

    try {
      const cmd: LoginUserCommand = { cmd: req.body };
      // Trả về cả cụm token
      const tokens = await this.loginCmdHandler.execute(cmd);

      res.status(200).json({
        message: 'Đăng nhập thành công',
        data: tokens, // data bây giờ chứa { accessToken, refreshToken }
      });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }
}
