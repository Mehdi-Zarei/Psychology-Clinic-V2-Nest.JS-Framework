import { AvailableTimeEntity } from "src/available-time/entities/available-time.entity";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { ReviewEntity } from "src/review/entities/review.entity";
import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.appointments, {
    onDelete: "CASCADE",
  })
  user: UserEntity;

  @ManyToOne(
    () => PsychologistEntity,
    (psychologist) => psychologist.appointments,
    { onDelete: "CASCADE" },
  )
  psychologist: PsychologistEntity;

  @OneToOne(() => AvailableTimeEntity, { eager: true, nullable: true })
  @JoinColumn({ name: "availableTimeId" })
  availableTime: AvailableTimeEntity | null;

  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column({ type: "timestamptz" })
  endTime: Date;

  @Column()
  date: Date;

  @Column({
    type: "enum",
    enum: ["reserved", "canceled", "done"],
    default: "reserved",
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
