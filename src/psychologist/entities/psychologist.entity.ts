import { AvailableTimeEntity } from "src/available-time/entities/available-time.entity";
import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class PsychologistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avatar: string;

  @Column("text", { array: true })
  education: string;

  @Column()
  licenseNumber: number;

  @Column()
  aboutMe: string;

  @Column("text", { array: true })
  specialization: string[];

  @Column()
  experienceYears: number;

  @Column({ default: 5 })
  rating: number;

  @OneToOne(() => UserEntity, (user) => user.psychologist, { eager: true })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => AvailableTimeEntity, (available) => available.psychologist)
  availableTime: AvailableTimeEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
