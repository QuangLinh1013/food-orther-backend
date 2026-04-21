/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable prettier/prettier */
import { z } from 'zod';

// DTO cho lúc Đăng ký
export const UserCreatedDTOSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
export type UserCreatedDTOSchema = z.infer<typeof UserCreatedDTOSchema>;

// DTO cho Update và Condition (Tạm thời để trống cho các API sau)
export const UserUpdateDTOSchema = z.object({
  status: z.enum(['active', 'inactive', 'deleted']).optional(),
  refresh_token: z.string().nullable().optional(),
});
export type UserUpdateDTOSchema = z.infer<typeof UserUpdateDTOSchema>;

export type UserCondDTO = {
  email?: string;
};
export const UserLoginDTOSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
export type UserLoginDTOSchema = z.infer<typeof UserLoginDTOSchema>;