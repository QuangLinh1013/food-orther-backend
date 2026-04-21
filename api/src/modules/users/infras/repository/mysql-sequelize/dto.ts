/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { DataTypes, Model, Sequelize } from 'sequelize';
import {
  encrypt,
  decrypt,
  encryptDeterministic,
  decryptDeterministic,
} from '../../../../../share/utils/encryption';
export class UserPersistence extends Model {}

export const ModelName = 'users';

export function init(sequelize: Sequelize) {
  UserPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Đảm bảo email không bị trùng
        get() {
          const rawValue = this.getDataValue('email');
          return rawValue ? decryptDeterministic(rawValue) : null;
        },
        set(value: string) {
          this.setDataValue(
            'email',
            value ? encryptDeterministic(value) : null,
          );
        },
      },
      password: {
        type: DataTypes.STRING, // Sẽ lưu chuỗi hash của bcrypt
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('refresh_token');
          return rawValue ? decrypt(rawValue) : null;
        },
        set(value: string) {
          this.setDataValue('refresh_token', value ? encrypt(value) : null);
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: ModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'users',
    },
  );
}
