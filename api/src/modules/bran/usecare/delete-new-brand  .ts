/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { v7 } from 'uuid';
import { ModelStatus } from '../../../share/model/base-model';
import { DeleteCommand, IBrandRepository, ICommandHandler, UpdateCommand } from '../interface';
import { ErrDataNotFound } from '../../../share/model/base-error';

export class DeleteNewBrandCmdHandler implements ICommandHandler<
  DeleteCommand,
  void
> {
  constructor(private readonly repository: IBrandRepository) {}
  
  async execute(command: DeleteCommand): Promise<void> {
    const data = await this.repository.get(command.id);

    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    } 
    await this.repository.delete(command.id);
    return;
  }
}
