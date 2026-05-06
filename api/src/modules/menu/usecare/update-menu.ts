/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IMenuRepository } from '../interface';
import { MenuUpdateDTO } from '../model/menu';
import { RedisComponent } from '../../../share/conponent/redis/index'; // Import Redis

export class UpdateMenuUseCase implements ICommandHandler<
  { id: string; data: MenuUpdateDTO },
  boolean
> {
  constructor(private readonly repository: IMenuRepository) {}

  async execute(payload: {
    id: string;
    data: MenuUpdateDTO;
  }): Promise<boolean> {
    // Cập nhật xuống MySQL (không check tồn tại, Sequelize chỉ cập nhật nếu có)
    console.log('✏️ Cập nhật menu ID:', payload.id, 'với data:', payload.data);
    
    const isSuccess = await this.repository.update(payload.id, payload.data);

    if (!isSuccess) {
      throw new Error('Cập nhật món ăn thất bại');
    }

    // Xóa Cache Redis nếu update thành công
    try {
      const redisClient = await RedisComponent.getInstance();
      const keys = await redisClient.keys('menu_list_*');
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(
          `🧹 Đã dọn dẹp ${keys.length} cache vì món ăn vừa được cập nhật!`,
        );
      }
    } catch (error: any) {
      console.error('⚠️ Lỗi khi xóa cache Redis:', error.message);
    }

    console.log('✅ Cập nhật thành công ID:', payload.id);
    return true;
  }
}
