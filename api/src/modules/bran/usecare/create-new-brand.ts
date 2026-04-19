/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { v7 } from "uuid";
import { ModelStatus } from "../../../share/model/base-model";
import { CreateCommand, IBrandRepository, ICommandHandler } from "../interface";
import { BrandCreatedDTOSchema } from "../model/dto";
import { ErrBrandNameDuplicate } from "../model/errors";

export class CreateNewBrandCmdCommand implements ICommandHandler <CreateCommand, string> {
    constructor(private readonly repository: IBrandRepository) {}
   
    async execute(command: CreateCommand): Promise<string> {
    const {
      success,
      data: parseData,
      error,
    } = BrandCreatedDTOSchema.safeParse(command.cmd);
    if (!success) {
      throw new Error(error.message);
    }
    const isExist = await this.repository.findByCond({ name: parseData.name });
    if (isExist) {
      throw ErrBrandNameDuplicate;
    }
    const newId = v7();
    const newBrand = {
      ...parseData,
      id: newId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.insert(newBrand);
    return newId;
    }
} 