import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (author) => author.article)
  author: UserEntity;

  @Column({ unique: true })
  slug: string;

  @Column("text", { array: true, nullable: true, default: [] })
  images: string[];

  @Column({ unique: true })
  shortIdentifier: string;

  @Column()
  summary: string;

  @Column("text", { array: true })
  tags: string[];

  @Column({ type: "boolean", default: false })
  isPublished: boolean;

  @Column({ default: 0 })
  views: number;

  @ManyToMany(() => UserEntity, (user) => user.likedArticles)
  @JoinTable()
  likedBy: UserEntity[];

  @Column()
  readingTime: number;

  @Column()
  seoTitle: string;

  @Column()
  seoDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
