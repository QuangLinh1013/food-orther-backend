/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { IMenuRepository } from '../interface';
import { Menu, MenuCreateDTO } from '../model/menu';
import { ModelStatus } from '../../../share/model/base-model';
import { RedisComponent } from '../../../share/conponent/redis/index'; // Import Redis

export class CreateMenuUseCase implements ICommandHandler<
  MenuCreateDTO,
  string
> {
  constructor(private readonly repository: IMenuRepository) {}

  async execute(data: MenuCreateDTO): Promise<string> {
    // 1. Tạo ID ngẫu nhiên cho món ăn mới
    const newId = uuidv4();

    // 2. Map dữ liệu từ DTO sang Model chuẩn
    const newMenu: Menu = {
      id: newId,
      name: data.name,
      description: data.description,
      price: data.price,
      available_quantity: data.available_quantity,
      status: ModelStatus.ACTIVE,
    };

    // 3. Lưu vào MySQL
    const isSuccess = await this.repository.insert(newMenu);
    if (!isSuccess) {
      throw new Error('Lưu món ăn vào Database thất bại');
    }

    // ==========================================
    // 4. CACHE INVALIDATION (XÓA BỘ NHỚ ĐỆM CŨ)
    // ==========================================
    const redisClient = await RedisComponent.getInstance();

    // Tìm tất cả các chìa khóa (keys) bắt đầu bằng "menu_list_"
    // (Trong thực tế hệ thống siêu lớn người ta dùng SCAN, nhưng với project này dùng KEYS là đủ)
    const keys = await redisClient.keys('menu_list_*');

    if (keys.length > 0) {
      // Xóa sạch các cache cũ đi để user gọi API GET sẽ nhận được dữ liệu mới
      await redisClient.del(keys);
      console.log(`🧹 Đã dọn dẹp sạch sẽ ${keys.length} cache cũ của Menu!`);
    }

    return newId; // Trả về ID của món ăn vừa tạo
  }
}
