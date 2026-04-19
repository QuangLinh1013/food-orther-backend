/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { PagingDTOSchema } from '../../../../share/model/paging';
import { CreateCommand, DeleteCommand, GetDetailQuery, IBrandUseCase, ICommandHandler, IQueryHandler, UpdateCommand } from '../../interface';
import { Brand } from '../../model/brand';
import { BrandCreatedDTOSchema, BrandUpdateDTOSchema } from '../../model/dto';
import { Request, Response } from 'express';

export class BrandHttpSevice {
  constructor(
    private readonly createCmdHanler: ICommandHandler<CreateCommand, string>,
    private readonly getDetailQueryHandler: IQueryHandler<GetDetailQuery, Brand | null>,
    private readonly updateCmdHandler: ICommandHandler<UpdateCommand, void>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteCommand, void>,
    private readonly useCase: IBrandUseCase
  ) {}
  async createAPI(req: Request, res: Response) {
    const { success, data, error } = BrandCreatedDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error.message });
      return;
    }

    try {
      const cmd : CreateCommand = { cmd: req.body };
      const result = await this.createCmdHanler.execute(cmd);
      res.status(201).json({ id: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async getDetail(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const result = await this.getDetailQueryHandler.execute({ id });
    res.status(200).json({ data: result });
  }
  async updateAPI(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const cmd : UpdateCommand = { id, cmd: req.body };
    const result = await this.updateCmdHandler.execute(cmd);
    res.status(200).json({ data: result });
  }
  async deleteAPI(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    try {
      await this.deleteCmdHandler.execute({ id, isHartDelete: false });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async listAPI(req: Request, res: Response) {
    const {
      success,
      data: paging,
      error,
    } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      res
        .status(400)
        .json({ message: 'Invalid paging parameters', error: error.message });
      return;
    }
    const result = await this.useCase.list({}, paging);
    res.status(200).json({ data: result, paging, filter: {} });
  }
}
