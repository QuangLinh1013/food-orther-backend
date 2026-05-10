/* eslint-disable prettier/prettier */
import { Model, DataTypes, Sequelize } from 'sequelize';

export class InventoryModel extends Model {
  declare id: string;
  declare menuId: string;
  declare quantity: number;
  declare version: number;
}
export class InventoryLogModel extends Model {
  declare id: string;
  declare menuId: string;
  declare actionType: string;
  declare quantityChanged: number;
  declare balanceAfter: number;
  declare referenceId: string | null;
}
export const initInventoryModel = (sequelize: Sequelize) => {
  // Khởi tạo bảng inventories (Giữ nguyên)
  InventoryModel.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      menuId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'menu_id',
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      tableName: 'inventories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  // Khởi tạo bảng inventory_logs (MỚI THÊM)
  InventoryLogModel.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      menuId: { type: DataTypes.UUID, allowNull: false, field: 'menu_id' },
      actionType: {
        type: DataTypes.ENUM('RESTOCK', 'DEDUCT', 'ROLLBACK'),
        allowNull: false,
        field: 'action_type',
      },
      quantityChanged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantity_changed',
      },
      balanceAfter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'balance_after',
      },
      referenceId: { type: DataTypes.UUID, field: 'reference_id' },
    },
    {
      sequelize,
      tableName: 'inventory_logs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false, // Bảng log chỉ cần biết lúc tạo ra, không bao giờ update
    },
  );
};