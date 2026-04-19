/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { v7 } from 'uuid';
import { ModelStatus } from '../../../share/model/base-model';
import { IBrandRepository, ICommandHandler, UpdateCommand } from '../interface';
import { BrandUpdateDTOSchema } from '../model/dto';
import { ErrBrandNameDuplicate } from '../model/errors';
import { ErrDataNotFound } from '../../../share/model/base-error';

export class UpdateNewBrandCmdHandler implements ICommandHandler<
  UpdateCommand,
  void
> {
  constructor(private readonly repository: IBrandRepository) {}
  
  async execute(command: UpdateCommand): Promise<void> {
    const {
      success,
      data: parsedData,
      error,
    } = BrandUpdateDTOSchema.safeParse(command.cmd);
    if (!success) {
      throw new Error('Invalid data: ' + error.message);
    }
    const data = await this.repository.get(command.id);

    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.update(command.id, parsedData);
    return;
  }
}
