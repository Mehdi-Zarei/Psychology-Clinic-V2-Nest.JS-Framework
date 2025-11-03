import { BookingEntity } from "src/booking/entities/booking.entity";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isAccept: boolean;

  @Column({ type: "integer", default: 5 })
  rating: number;

  @ManyToOne(() => UserEntity, (user) => user.review, { onDelete: "CASCADE" })
  user: UserEntity;

  @ManyToOne(() => PsychologistEntity, (psychologist) => psychologist.reviews, {
    onDelete: "CASCADE",
  })
  psychologist: PsychologistEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
