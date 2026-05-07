/* eslint-disable prettier/prettier */
import { ICommandHandler } from '../../../share/interface';
import { IInventoryRepository } from '../interface';
import { DeductInventoryDTO, DeductInventorySchema } from '../model/inventory';

export class DeductInventoryUseCase implements ICommandHandler<
  DeductInventoryDTO,
  boolean
> {
  constructor(private readonly repository: IInventoryRepository) {}

  async execute(data: DeductInventoryDTO): Promise<boolean> {
    // 1. Zod xác thực dữ liệu đầu vào
    const validData = DeductInventorySchema.parse(data);

    // 2. Lấy thông tin kho hiện tại (để lấy số lượng và CÁI VERSION QUAN TRỌNG)
    const inventory = await this.repository.getByMenuId(validData.menuId);
    
    if (!inventory) {
      throw new Error('Sản phẩm này chưa được khởi tạo trong kho!');
    }

    if (inventory.quantity < validData.quantity) {
      throw new Error('Số lượng tồn kho không đủ để đáp ứng đơn hàng này.');
    }

    // 3. Ra lệnh trừ kho, gửi kèm version mà mình vừa nhìn thấy
    const isSuccess = await this.repository.deduct(
      validData.menuId,
      validData.quantity,
      inventory.version, // <--- Chìa khóa chống bán lố nằm ở đây
    );

    // 4. Nếu MySQL trả về false (nghĩa là có thằng khác đã đổi version trước mình 1 mili-giây)
    if (!isSuccess) {
      throw new Error(
        'Sản phẩm vừa bị khách hàng khác nhanh tay mua mất. Vui lòng đặt lại!',
      );
    }

    return true;
  }
}
