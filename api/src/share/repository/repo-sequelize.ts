/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IRepository } from '../interface';
import { Sequelize, Op } from 'sequelize';
import { PagingDTO } from '../model/paging';
import { ModelStatus } from '../model/base-model';

export abstract class BaseRepositorySequelize<
  Entity extends { createdAt?: Date; updatedAt?: Date },
  Cond,
  UpdateDTO,
> implements IRepository<Entity, Cond, UpdateDTO> {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string,
  ) {}

  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) {
      return null;
    }
    const plainData = data.get({ plain: true }) as Entity;
    return {
      ...plainData,
      createdAt: plainData.createdAt,
      updatedAt: plainData.updatedAt,
    } as Entity;
  }
  async findByCond(cond: Cond): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: cond as any,
    });
    if (!data) {
      return null;
    }
    const plainData = data.get({ plain: true });
    return plainData as Entity;
  }
  async list(
    cond: Cond, // cond lúc này đang chứa { name: 'ABC' }
    paging: PagingDTO,
  ): Promise<Array<Entity>> {
    const { page, limit } = paging;

    // 1. Khởi tạo điều kiện mặc định: Bỏ qua những category đã bị xóa
    const condSQL: any = {
      status: { [Op.ne]: ModelStatus.DELETED },
    };
    // 3. Lệnh count (Lưu ý: Code cũ của bạn gọi count nhưng vứt xó kết quả, mình lưu vào biến total nhé)
    const total = await this.sequelize.models[this.modelName].count({ where: condSQL, });
    paging.total = total;
    // 4. Lệnh lấy danh sách (Lúc này where đã chứa đầy đủ điều kiện)
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL, // Đã có tên 'ABC' trong này
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    // Trả về data (Nếu bạn muốn trả về cả meta phân trang thì nhớ return thêm biến total ở trên nhé)
    return rows.map((row) => row.get({ plain: true }),
    );
  }

  async insert(data: Entity): Promise<boolean> {
    try {
      // 1. Log dữ liệu ra để xem chúng ta đang thực sự gửi gì xuống DB
      console.log('🚀 Payload chuẩn bị Insert:', data);

      // 2. Thực hiện lệnh create
      await this.sequelize.models[this.modelName].create(
        data as unknown as Record<string, unknown>,
      );

      return true;
    } catch (error: any) {
      // 3. Nếu DB chửi, in ngay câu chửi đó ra màn hình
      console.error('❌ Lỗi Sequelize/MySQL tại Repository:', error.message);

      // In chi tiết lỗi của từng cột (nếu có)
      if (error.errors) {
        console.error(
          '👉 Chi tiết cột bị lỗi:',
          error.errors.map((e: any) => e.message),
        );
      }

      // 4. Ném lỗi này lên cho UseCase xử lý tiếp (nếu không có dòng này, HttpService sẽ tưởng là thành công)
      throw error;
    }
  }
  async update(id: string, data: UpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, {
      where: { id },
    });
    return true;
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (isHard) {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    } else {
      await this.sequelize.models[this.modelName].update(
        { status: ModelStatus.DELETED },
        { where: { id } },
      );
    }
    return true;
  }
}
