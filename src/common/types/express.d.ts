import { UserEntity } from "../user/entities/user.entity";
import "express";

declare module "express" {
  export interface Request {
    user?: UserEntity;
  }
}
