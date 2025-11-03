import { AvailableTimeEntity } from "src/available-time/entities/available-time.entity";
import { BookingEntity } from "src/booking/entities/booking.entity";
import { ReviewEntity } from "src/review/entities/review.entity";
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
  name: string;

  @Column()
  avatar: string;

  @Column("text", { array: true })
  education: string[];

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

  @Column({ default: false })
  isActive: boolean;

  @OneToOne(() => UserEntity, (user) => user.psychologist)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => AvailableTimeEntity, (available) => available.psychologist)
  availableTime: AvailableTimeEntity[];

  @OneToMany(() => BookingEntity, (book) => book.psychologist)
  appointments: BookingEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.psychologist)
  reviews: ReviewEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
