/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import {
  CategoryCondDTOSchema,
  CategoryCondDTO,
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from '../../model/dto';
import { ICategoryUseCase } from '../../interface';

export class CategoryHttpService {
  constructor(private readonly useCase: ICategoryUseCase) {}

  async createANewCategoryAPI(req: Request, res: Response) {
    try {
      // 1. Không dùng destructuring ở đây
      const parsed = CategoryCreateSchema.safeParse(req.body);

      // 2. Kiểm tra parsed.success
      if (!parsed.success) {
        // Lúc này TypeScript chắc chắn 100% parsed.error tồn tại
        res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: parsed.error.issues,
        });
        return;
      }

      // 3. Lấy data ra sau khi đã chắc chắn parse thành công
      const result = await this.useCase.createANewCategory(parsed.data);
      res.status(201).json({ data: result });
    } catch (error: any) {
      console.error('❌ Lỗi createANewCategoryAPI:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  async getDetailCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const result = await this.useCase.getDetailCategory(id);

      res.status(200).json({ data: result });
    } catch (error: any) {
      if (error.message === 'Data not found') {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      console.error('❌ Lỗi getDetailCategoryAPI:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      // Sửa lỗi TypeScript tương tự như Create
      const parsed = CategoryUpdateSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: parsed.error.issues,
        });
        return;
      }

      await this.useCase.updateCategory(id, parsed.data);
      res.status(200).json({ message: 'Category updated successfully' });
    } catch (error: any) {
      if (
        error.message === 'Data not found' ||
        error.message === 'Category not found'
      ) {
        res
          .status(404)
          .json({ message: 'Category not found or already deleted' });
        return;
      }
      console.error('❌ Lỗi updateCategoryAPI:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await this.useCase.deleteCategory(id);

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      if (
        error.message === 'Data not found' ||
        error.message === 'Category not found'
      ) {
        res
          .status(404)
          .json({ message: 'Category not found or already deleted' });
        return;
      }
      console.error('❌ Lỗi deleteCategoryAPI:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async listCategoryAPI(req: Request, res: Response) {
    try {
      const { page, limit, ...filterParams } = req.query;

      const parseQueryValue = (value: unknown): string | undefined => {
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === 'string'
        ) {
          return value[0];
        }
        return typeof value === 'string' ? value : undefined;
      };

      const paging = {
        page: parseInt(parseQueryValue(page) ?? '1', 10),
        limit: parseInt(parseQueryValue(limit) ?? '10', 10),
      };

      const condInput: Record<string, unknown> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        const normalized = parseQueryValue(value);
        if (normalized !== undefined) {
          condInput[key] = normalized;
        }
      });

      // Viết lại logic kiểm tra để TypeScript không bị ngáo (Không cần @ts-ignore nữa)
      let parsedData: CategoryCondDTO = {};

      if (Object.keys(condInput).length > 0) {
        const parsed = CategoryCondDTOSchema.safeParse(condInput);
        if (!parsed.success) {
          res
            .status(400)
            .json({ message: 'Invalid filters', errors: parsed.error.issues });
          return;
        }
        parsedData = parsed.data;
      }

      const result = await this.useCase.listCategory(parsedData, paging);
      res.status(200).json({ data: result });
    } catch (error) {
      console.error('❌ Lỗi trong listCategoryAPI:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
