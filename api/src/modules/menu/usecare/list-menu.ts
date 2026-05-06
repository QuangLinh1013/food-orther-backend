/* eslint-disable prettier/prettier */
import { IQueryHandler } from '../../../share/interface';
import { IMenuRepository } from '../interface';
import { Menu, MenuCondDTO } from '../model/menu';
import { ModelStatus } from '../../../share/model/base-model';
import { RedisComponent } from '../../../share/conponent/redis/index'; // Import Redis

export class ListMenuUseCase implements IQueryHandler<MenuCondDTO, Menu[]> {
  constructor(private readonly repository: IMenuRepository) {}

  async execute(query: MenuCondDTO): Promise<Menu[]> {
    // 1. Chuẩn hóa điều kiện tìm kiếm
    const finalQuery: MenuCondDTO = {
      ...query,
      status: query.status || ModelStatus.ACTIVE,
    };

    // 2. TẠO CACHE KEY: Mỗi câu query sẽ có một "chìa khóa" duy nhất
    // Ví dụ nếu gọi /menus?status=active -> Key sẽ là "menu_list_{"status":"active"}"
    const cacheKey = `menu_list_${JSON.stringify(finalQuery)}`;

    // 3. Lấy đối tượng kết nối Redis
    const redisClient = await RedisComponent.getInstance();

    // ==========================================
    // THUẬT TOÁN CACHE-ASIDE BẮT ĐẦU Ở ĐÂY
    // ==========================================

    // BƯỚC A: TÌM TRONG TỦ LẠNH (REDIS) TRƯỚC
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('⚡ TỐC ĐỘ BÀN THỜ: Lấy dữ liệu từ Redis Cache!');
      // Redis lưu dạng chuỗi (String), nên lấy ra phải parse về lại JSON (Array)
      return JSON.parse(cachedData) as Menu[];
    }

    // BƯỚC B: NẾU REDIS KHÔNG CÓ -> CHẠY XUỐNG BẾP (MYSQL) TÌM
    console.log('🐢 CHẬM CHẠP: Lấy dữ liệu từ MySQL...');
    const menus = await this.repository.list(finalQuery);

    // BƯỚC C: CẤT VÀO TỦ LẠNH ĐỂ LẦN SAU XÀI LẠI (Set thời gian sống - TTL)
    if (menus.length > 0) {
      // Hàm setEx(key, số_giây, giá_trị)
      // Ở đây ta lưu 600 giây (tức là 10 phút). Sau 10 phút nó tự bốc hơi.
      await redisClient.setEx(cacheKey, 600, JSON.stringify(menus));
    }

    return menus;
  }
}
