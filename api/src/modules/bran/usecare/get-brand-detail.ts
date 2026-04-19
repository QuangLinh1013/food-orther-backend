/* eslint-disable prettier/prettier */

import { IQueryRepository } from '../../../share/interface';
import { ErrDataNotFound } from '../../../share/model/base-error';
import { GetDetailQuery, IQueryHandler } from '../interface';
import { Brand } from '../model/brand';
import { BrandCondDTO } from '../model/dto';
import { ModelStatus } from '../../../share/model/base-model';

export class GetBrandDetailQuery implements IQueryHandler<
  GetDetailQuery,
  Brand | null
> {
  constructor(private readonly repository: IQueryRepository<Brand, BrandCondDTO>) {}
  async execute(query: GetDetailQuery): Promise<Brand | null> {
    const data = await this.repository.get(query.id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return data;
  }
}
