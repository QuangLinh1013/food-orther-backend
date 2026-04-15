/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataTypes, Model, Sequelize } from 'sequelize';
import { CategoryStatus } from '../../model/model';

export class CategoryPersistence extends Model {
  declare id: string;
  declare status: CategoryStatus;
}

export const modelName = 'Category';

export function init(sequelize: Sequelize) {
  CategoryPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.STRING,
        field: 'parent_id',
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      tableName: 'categories',
    },
  );
}
