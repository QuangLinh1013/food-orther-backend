import { z } from 'zod';

// Giả sử bạn có file base-model chứa enum status (active, inactive, deleted)
import { ModelStatus } from '../../../share/model/base-model';

// 1. Schema chuẩn của một Món ăn
export const MenuSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Tên món ăn phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá tiền không được âm'),
  available_quantity: z.number().int().min(0, 'Số lượng không được âm'),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Menu = z.infer<typeof MenuSchema>;

// 2. DTO dùng để Create (Người dùng gửi lên)
export const MenuCreateDTOSchema = MenuSchema.pick({
  name: true,
  description: true,
  price: true,
  available_quantity: true,
});
export type MenuCreateDTO = z.infer<typeof MenuCreateDTOSchema>;

// 3. DTO dùng để Update
export const MenuUpdateDTOSchema = MenuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();
export type MenuUpdateDTO = z.infer<typeof MenuUpdateDTOSchema>;

// 4. DTO dùng để Tìm kiếm / Lấy danh sách
export interface MenuCondDTO {
  id?: string;
  name?: string;
  status?: ModelStatus;
}
