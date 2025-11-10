import { ArticleEntity } from "src/article/entities/article.entity";
import { BookingEntity } from "src/booking/entities/booking.entity";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { ReviewEntity } from "src/review/entities/review.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
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

  @OneToMany(() => BookingEntity, (book) => book.user)
  appointments: BookingEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  review: ReviewEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.author, {
    onDelete: "CASCADE",
  })
  article: ArticleEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.likedBy, {
    onDelete: "CASCADE",
  })
  likedArticles: ArticleEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
