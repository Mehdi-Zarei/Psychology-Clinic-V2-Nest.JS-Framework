import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
  hashData(data: any) {
    const hash = bcrypt.hash(data, 12);
    return hash;
  }

  compareData(data: any, hashedDate: any) {
    const compare = bcrypt.compare(data, hashedDate);
    return compare;
  }
}
