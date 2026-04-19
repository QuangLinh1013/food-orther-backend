/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable prettier/prettier */
import { PagingDTO } from '../../../share/model/paging';
import { Brand } from '../model/brand';
import { BrandCondDTO, BrandCreatedDTOSchema, BrandUpdateDTOSchema,  } from '../model/dto';
import { IRepository } from '../../../share/interface/index';
export interface IBrandUseCase {
  create(data: BrandCreatedDTOSchema): Promise<string>;
  getDetail(id: string): Promise<Brand | null>;
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<Brand>>;
  update(id: string, data: BrandUpdateDTOSchema): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
export interface CreateCommand {
 cmd: BrandCreatedDTOSchema;
}
export interface ICommandHandler <Cmd, Result> {
  execute(command: Cmd): Promise<Result>;
}
export interface GetDetailQuery {
  id: string;
}
export interface IQueryHandler <Query, Result> {
  [x: string]: any;
  execute(query: Query): Promise<Result>;
}
export interface UpdateCommand {
  id: string;
  cmd: BrandUpdateDTOSchema;
}
export interface DeleteCommand {
  id: string;
  isHartDelete: boolean;
}
export interface IBrandRepository extends IRepository<Brand, BrandCondDTO, BrandUpdateDTOSchema> {}
