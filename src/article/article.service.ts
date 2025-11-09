import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "./entities/article.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { nanoid } from "nanoid";
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
    file: Express.Multer.File[],
  ) {
    let {
      title,
      content,
      summary,
      isPublished,
      readingTime,
      seoDescription,
      seoTitle,
      tags,
      images,
    } = createArticleDto;

    const isArticleRepetitive = await this.articleRepository.findOne({
      where: { title },
    });
    if (isArticleRepetitive) {
      throw new ConflictException("Article is repetitive.");
    }

    let uniqueSlug = title
      .replace(/[^\w\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const isRepetitiveSlug = await this.articleRepository.findOne({
      where: { slug: uniqueSlug },
    });
    if (isRepetitiveSlug) {
      uniqueSlug += `-${Math.random().toString(36).substring(2)}`;
    }

    if (file && file.length > 0) {
      images = file.map(
        (img) => `${process.env.DOMAIN}/images/article/${img.filename}`,
      );
    }

    let uniqueIdentifier = nanoid(7);
    const isRepetitiveIdentifier = await this.articleRepository.findOne({
      where: { shortIdentifier: uniqueIdentifier },
    });
    if (isRepetitiveIdentifier) {
      uniqueIdentifier += `-${Math.random().toString(36).substring(2)}`;
    }

    const newArticle = this.articleRepository.create({
      title,
      content,
      summary,
      isPublished,
      readingTime,
      seoDescription,
      seoTitle,
      tags,
      images,
      author: { id: userId },
      shortIdentifier: uniqueIdentifier,
      slug: uniqueSlug,
    });

    await this.articleRepository.save(newArticle);

    return { message: "Article Created Successfully." };
  }

  async findAll() {
    const articles = await this.articleRepository.find({
      where: { isPublished: true },
      relations: ["author"],
      select: {
        id: true,
        author: { name: true },
        images: true,
        summary: true,
        title: true,
        views: true,
      },
    });

    if (!articles.length) {
      throw new NotFoundException("Article Not Found !!");
    }

    return articles;
  }

  async findOne(id: number) {
    const mainArticle = await this.articleRepository.findOne({
      where: { id, isPublished: true },
      relations: ["author"],
      select: {
        author: { name: true },
      },
    });
    if (!mainArticle) {
      throw new NotFoundException("Article Not Found !!");
    }

    await this.articleRepository.increment({ id }, "views", 1);

    return mainArticle;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
