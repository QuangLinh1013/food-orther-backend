/* eslint-disable prettier/prettier */
import { Model, DataTypes, Sequelize } from 'sequelize';

// 1. Model cho bảng orders
export class OrderModel extends Model {
  declare id: string;
  declare userId: string;
  declare totalAmount: number;
  declare status: string;
}

// 2. Model cho bảng order_items
export class OrderItemModel extends Model {
  declare id: string;
  declare orderId: string;
  declare menuId: string;
  declare quantity: number;
  declare price: number;
}

export const initOrderModels = (sequelize: Sequelize) => {
  OrderModel.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
      totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_amount',
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'completed'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  OrderItemModel.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      orderId: { type: DataTypes.UUID, allowNull: true, field: 'order_id' },
      menuId: { type: DataTypes.UUID, allowNull: false, field: 'menu_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      tableName: 'order_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  // Thiết lập quan hệ: 1 Order có nhiều OrderItems
  OrderModel.hasMany(OrderItemModel, {
    foreignKey: 'order_id',
    as: 'items',
    onDelete: 'CASCADE', // Thêm dòng này
  });

  OrderItemModel.belongsTo(OrderModel, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE', // Thêm dòng này
  });
};
