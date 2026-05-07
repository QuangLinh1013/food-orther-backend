/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Sequelize } from 'sequelize';
import { BaseRepositorySequelize } from '../../../../../share/repository/repo-sequelize';
import { IMenuRepository } from '../../../interface';
import { Menu, MenuCondDTO, MenuUpdateDTO } from '../../../model/menu';
import { ModelName } from './dto';
import { ModelStatus } from '../../../../../share/model/base-model';

export class MyMenuRepository
  extends BaseRepositorySequelize<Menu, MenuCondDTO, MenuUpdateDTO>
  implements IMenuRepository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, ModelName);
  }
  async getById(productId: string): Promise<Menu | null> {
    const menu = await this.sequelize.models[ModelName].findOne({
      where: { id: productId },
    });
    if (!menu) return null;
    return menu.get({ plain: true }) as Menu;
  }

  // Bổ sung hàm lấy danh sách (vì Base Repo thường chỉ có tìm 1 record)
  async list(cond: MenuCondDTO): Promise<Menu[]> {
    const models = await this.sequelize.models[ModelName].findAll({
      where: cond as any,
      order: [['created_at', 'DESC']], // Món ăn mới thêm sẽ hiển thị lên đầu
    });

    // Ép kiểu dữ liệu Sequelize Model về dạng Object thuần (Plain Object) của Domain
    return models.map((m) => m.get({ plain: true }) as Menu);
  }
  async update(id: string, data: MenuUpdateDTO): Promise<boolean> {
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
