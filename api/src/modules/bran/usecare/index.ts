/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IRepository } from '../../../share/interface/index';
import {
  BrandCondDTO,
  BrandCreatedDTOSchema,
  BrandUpdateDTOSchema,
} from '../model/dto';
import { Brand } from '../model/brand';
import { IBrandUseCase } from '../interface';
import { PagingDTO } from '../../../share/model/paging';
import { v7 } from 'uuid';
import id from 'zod/v4/locales/id.js';
import { Model } from 'sequelize';
import { ModelStatus } from '../../../share/model/base-model';
import { ErrBrandNameDuplicate } from '../model/errors';

export class BrandUseCase implements IBrandUseCase {
  constructor(
    private readonly repository: IRepository<
      Brand,
      BrandCondDTO,
      BrandUpdateDTOSchema
    >,
  ) {}
  async create(data: BrandCreatedDTOSchema): Promise<string> {
    return '';
  }
  getDetail(id: string): Promise<Brand | null> {
    throw new Error('Method not implemented.');
  }
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<Brand>> {
    throw new Error('Method not implemented.');
  }
  update(id: string, data: BrandUpdateDTOSchema): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
