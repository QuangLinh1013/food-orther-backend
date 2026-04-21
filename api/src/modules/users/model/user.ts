/* eslint-disable prettier/prettier */
import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export const ModelName = 'users';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'), // Chứa chuỗi đã hash (bcrypt)
  refresh_token: z.string().nullish(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
