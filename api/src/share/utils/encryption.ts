/* eslint-disable prettier/prettier */
import * as crypto from 'crypto';
// CƠ CHẾ MÃ HÓA ĐƠN GIẢN SỬ DỤNG THƯ VIỆN CRYPTO CỦA NODEJS
// KHÓA BẢO MẬT (Trong thực tế phải đưa vào file .env)
// Yêu cầu: Khóa phải có độ dài chính xác 32 ký tự cho thuật toán aes-256
const ENCRYPTION_KEY = 'my_super_secret_key_32_chars_123';

// 1. MÃ HÓA NGẪU NHIÊN (Dùng cho refresh_token, address, phone...)
// Cùng 1 chữ "hello" nhưng mỗi lần mã hóa ra 1 chuỗi khác nhau
export function encrypt(text: string): string {
  if (!text) return text;
  const iv = crypto.randomBytes(16); // Tạo Vector khởi tạo ngẫu nhiên
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex'); // Lưu kèm IV để sau này giải mã
}

export function decrypt(text: string): string {
  if (!text) return text;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// 2. MÃ HÓA CỐ ĐỊNH (Dùng cho email - Để còn search và query DB được)
// Cùng 1 chữ "hello" luôn mã hóa ra 1 chuỗi giống hệt nhau
const STATIC_IV = Buffer.alloc(16, 0); // IV cố định
export function encryptDeterministic(text: string): string {
  if (!text) return text;
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    STATIC_IV,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

export function decryptDeterministic(text: string): string {
  if (!text) return text;
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    STATIC_IV,
  );
  let decrypted = decipher.update(Buffer.from(text, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
