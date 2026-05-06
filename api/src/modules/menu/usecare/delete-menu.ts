/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IMenuRepository } from '../interface';
import { ModelStatus } from '../../../share/model/base-model';
import { RedisComponent } from '../../../share/conponent/redis/index'; // Import Redis

export class DeleteMenuUseCase implements ICommandHandler<string, boolean> {
  constructor(private readonly repository: IMenuRepository) {}

  async execute(id: string): Promise<boolean> {
    try {
      // Log debug
      console.log('🗑️ Đang xóa menu ID:', id);

      // Đổi status thành deleted (không cần check tồn tại, cứ update)
      const isSuccess = await this.repository.update(id, { status: ModelStatus.DELETED });
      
      console.log('📊 Update result:', isSuccess);

      if (!isSuccess) {
        throw new Error('Xóa món ăn thất bại (update return false)');
      }

      // Xóa Cache Redis
      try {
        const redisClient = await RedisComponent.getInstance();
        const keys = await redisClient.keys('menu_list_*');
        if (keys.length > 0) {
          await redisClient.del(keys);
          console.log('🧹 Đã dọn dẹp cache vì có món ăn vừa bị xóa!');
        }
      } catch (error: any) {
        console.error('⚠️ Lỗi khi xóa cache Redis:', error.message);
      }

      console.log('✅ Xóa thành công ID:', id);
      return true;
    } catch (error: any) {
      console.error('❌ Lỗi khi xóa menu:', error.message);
      throw error;
    }
  }
}
