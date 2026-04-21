/* eslint-disable prettier/prettier */
export const ErrUserEmailDuplicate = new Error('Email này đã được đăng ký');
export const ErrUserNotFound = new Error('Không tìm thấy người dùng');
export const ErrInvalidCredentials = new Error(
  'Email hoặc mật khẩu không chính xác',
);
