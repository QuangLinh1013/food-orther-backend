import { ModelStatus } from '../../../share/model/base-model';
import { PagingDTO } from '../../../share/model/paging';
import { ICategoryUseCase, IRepository } from '../interface';
import {
  CategoryCondDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from '../model/dto';
import { Category } from '../model/model';
import { v7 } from 'uuid';

export class CategoryUseCase implements ICategoryUseCase {
  constructor(private readonly repository: IRepository) {}
  async listCategory(
    cond: CategoryCondDTO,
    paging: PagingDTO,
  ): Promise<Array<Category>> {
    const data = await this.repository.list(cond, paging);
    return data;
  }

  async createANewCategory(data: CategoryCreateDTO) {
    const newId = v7();
    const category: Category = {
      id: newId,
      name: data.name,
      position: 0,
      image: data.image,
      description: data.description,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(category);
    return newId;
  }
  async getDetailCategory(id: string): Promise<Category | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw new Error('Data not found');
    }
    return data;
  }

  async anlistCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO,
  ): Promise<Array<Category>> {
    const data = await this.repository.list(cond, paging);
    return data;
  }

  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const category = await this.getDetailCategory(id);
    if (!category || category.status === ModelStatus.DELETED) {
      throw new Error('Category not found');
    }
    await this.repository.update(id, data);
    return true;
  }
  async deleteCategory(id: string): Promise<boolean> {
    // 1. Kiểm tra category có tồn tại không
    const category = await this.getDetailCategory(id);

    if (!category) {
      throw new Error('Category not found');
    }

    // 2. Thực hiện xóa
    const result = await this.repository.delete(id);

    // 3. Kiểm tra kết quả xóa (tùy ORM, ví dụ Sequelize sẽ trả về số dòng bị ảnh hưởng)
    if (!result) {
      throw new Error('Delete failed');
    }

    return true;
  }
}
