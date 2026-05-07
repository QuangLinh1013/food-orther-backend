/* eslint-disable prettier/prettier */
import { Model, DataTypes, Sequelize } from 'sequelize';

export class InventoryModel extends Model {
  declare id: string;
  declare menuId: string;
  declare quantity: number;
  declare version: number;
}

export const initInventoryModel = (sequelize: Sequelize) => {
  InventoryModel.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      menuId: { type: DataTypes.UUID, allowNull: false, unique: true, field: 'menu_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      version: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    {
      sequelize,
      tableName: 'inventories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};