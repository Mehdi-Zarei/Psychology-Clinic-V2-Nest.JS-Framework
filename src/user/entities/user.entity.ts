import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: "enum", enum: ["ADMIN", "PSYCHOLOGIST", "USER"] })
  role: string;

  @Column({ default: false })
  isRestrict: boolean;

  @OneToOne(() => PsychologistEntity, (psychologist) => psychologist.user)
  psychologist: PsychologistEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
