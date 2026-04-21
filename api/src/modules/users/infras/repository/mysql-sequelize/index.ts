/* eslint-disable prettier/prettier */
import { BaseRepositorySequelize } from '../../../../../share/repository/repo-sequelize';
import { User } from '../../../model/user';
import { UserCondDTO, UserUpdateDTOSchema } from '../../../model/dto';
import { Sequelize } from 'sequelize';
import { ModelName } from './dto';
import { encryptDeterministic } from '../../../../../share/utils/encryption';

export class MyUserRepository extends BaseRepositorySequelize<
  User,
  UserCondDTO,
  UserUpdateDTOSchema
> {
  constructor(sequelize: Sequelize) {
    super(sequelize, ModelName);
  }
  async findByCond(cond: UserCondDTO): Promise<User | null> {
    // Tạo một bản sao của điều kiện tìm kiếm để không làm ảnh hưởng object gốc
    const queryCond = { ...cond };

    // Nếu trong điều kiện tìm kiếm có chứa email -> Phải mã hóa nó trước khi đem đi hỏi Database
    if (queryCond.email) {
      queryCond.email = encryptDeterministic(queryCond.email);
    }

    // Gọi lại hàm tìm kiếm của Base Repository với điều kiện đã được mã hóa
    return super.findByCond(queryCond);
  }
}
