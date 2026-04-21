/* eslint-disable prettier/prettier */
import { v7 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ModelStatus } from '../../../share/model/base-model';
import {
  CreateUserCommand,
  IUserRepository,
  ICommandHandler,
} from '../interface';
import { UserCreatedDTOSchema } from '../model/dto';
import { ErrUserEmailDuplicate } from '../model/error';

export class CreateNewUserCmdHandler implements ICommandHandler<
  CreateUserCommand,
  string
> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<string> {
    // 1. Validate dữ liệu đầu vào
    const {
      success,
      data: parseData,
      error,
    } = UserCreatedDTOSchema.safeParse(command.cmd);
    if (!success) {
      throw new Error(error.message);
    }

    // 2. Kiểm tra email đã tồn tại chưa
    const isExist = await this.repository.findByCond({
      email: parseData.email,
    });
    if (isExist) {
      throw ErrUserEmailDuplicate;
    }

    // 3. Hash mật khẩu (Mức độ salt thường là 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(parseData.password, saltRounds);

    // 4. Khởi tạo dữ liệu User mới
    const newId = v7();
    const newUser = {
      id: newId,
      email: parseData.email,
      password: hashedPassword, // Lưu mật khẩu đã hash
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 5. Lưu xuống DB qua Port
    await this.repository.insert(newUser);

    // Trả về ID của user vừa đăng ký
    return newId;
  }
}
