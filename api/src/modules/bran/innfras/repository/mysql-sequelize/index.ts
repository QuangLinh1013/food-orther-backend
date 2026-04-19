import { BaseRepositorySequelize } from '../../../../../share/repository/repo-sequelize';
import { Brand } from '../../../model/brand';
import { BrandCondDTO, BrandUpdateDTOSchema } from '../../../model/dto';
import { Sequelize } from 'sequelize';
import { ModelName } from './dto';

export class MyBrandRepository extends BaseRepositorySequelize<
  Brand,
  BrandCondDTO,
  BrandUpdateDTOSchema
> {
  constructor(sequelize: Sequelize) {
    super(sequelize, ModelName);
  }
}
