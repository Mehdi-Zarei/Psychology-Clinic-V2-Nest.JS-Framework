import { BookingEntity } from "src/booking/entities/booking.entity";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AvailableTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column({ type: "timestamptz" })
  endTime: Date;

  @Column()
  date: Date;

  @Column({ default: false })
  isBooked: boolean;

  @ManyToOne(
    () => PsychologistEntity,
    (psychologist) => psychologist.availableTime,
  )
  psychologist: PsychologistEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
