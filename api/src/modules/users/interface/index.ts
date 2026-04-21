/* eslint-disable prettier/prettier */
import { User } from '../model/user';
import {
  UserCondDTO,
  UserCreatedDTOSchema,
  UserLoginDTOSchema,
  UserUpdateDTOSchema,
} from '../model/dto';
import { IRepository } from '../../../share/interface/index';

// Cổng vào (Inbound Port) cho lệnh Register
export interface CreateUserCommand {
  cmd: UserCreatedDTOSchema;
}

export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>;
}

// Cổng ra (Outbound Port) cho Database
export type IUserRepository = IRepository<
  User,
  UserCondDTO,
  UserUpdateDTOSchema
>
export interface LoginUserQuery {
  cmd: UserLoginDTOSchema;
}

export interface IQueryHandler<Query, Result> {
  execute(query: Query): Promise<Result>;
}
