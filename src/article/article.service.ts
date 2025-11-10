import {
  ConflictException,
  ForbiddenException,
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
import * as fs from "fs";
import * as path from "path";

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

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    userId: number,
    file: Express.Multer.File[],
  ) {
    let {
      content,
      isPublished,
      readingTime,
      seoDescription,
      seoTitle,
      summary,
      tags,
      title,
    } = updateArticleDto;

    const mainArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!mainArticle) {
      throw new NotFoundException("Article Not Found !!");
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user?.role === "PSYCHOLOGIST" && mainArticle.author.id !== userId) {
      throw new ForbiddenException(
        "You Are Not Allowed To Update This Article.",
      );
    }

    let newImages: string[];

    if (content) mainArticle.content = content;
    if (isPublished) mainArticle.isPublished = isPublished;
    if (readingTime) mainArticle.readingTime = readingTime;
    if (seoDescription) mainArticle.seoDescription = seoDescription;
    if (seoTitle) mainArticle.seoTitle = seoTitle;
    if (summary) mainArticle.summary = summary;
    if (tags) mainArticle.tags = tags;
    if (title) mainArticle.title = title;
    if (file && file.length > 0) {
      mainArticle?.images?.forEach((imgPath) => {
        const fullPath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          imgPath.slice(21),
        );
        fs.unlink(fullPath, (err) => {
          if (err) console.error("❌ خطا در حذف فایل:", err.message);
        });
      });

      newImages = file.map(
        (img) => `${process.env.DOMAIN}/images/article/${img.filename}`,
      );

      mainArticle.images = newImages;
    }

    await this.articleRepository.save(mainArticle);

    return { message: "Article Updated Successfully." };
  }

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const mainArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!mainArticle) {
      throw new NotFoundException("Article Not Found !!");
    }

    if (user?.role === "PSYCHOLOGIST" && user.id !== mainArticle.author.id) {
      throw new ForbiddenException(
        "You Are Not Allowed To Delete This Article.",
      );
    }

    await this.articleRepository.delete(id);

    return { message: "Article Removed Successfully." };
  }

  async togglePublish(id: number, userId: number) {
    const mainArticle = await this.articleRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!mainArticle) {
      throw new NotFoundException("Article Not Found !!");
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { psychologist: true },
    });
    if (user?.role === "PSYCHOLOGIST" && mainArticle.author.id !== userId) {
      throw new ForbiddenException("You Are Not Allowed To This Article.");
    }

    mainArticle.isPublished = !mainArticle.isPublished;
    await this.articleRepository.save(mainArticle);

    return {
      message: mainArticle.isPublished
        ? "Article Published Successfully."
        : "Article Non Publish Successfully.",
    };
  }

  async toggleLike(id: number, userId: number) {
    const mainArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ["likedBy"],
    });
    if (!mainArticle) {
      throw new NotFoundException("Article Not Found !!");
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["likedArticles"],
    });
    if (!user) {
      throw new NotFoundException("User Not Found !!");
    }

    const hasLike = mainArticle.likedBy.some((u) => u.id === user.id);

    if (hasLike) {
      mainArticle.likedBy = mainArticle.likedBy.filter((u) => u.id !== userId);
      user.likedArticles = user.likedArticles.filter((a) => a.id !== id);
    } else {
      mainArticle.likedBy.push(user);
      user.likedArticles.push(mainArticle);
    }

    await this.articleRepository.save(mainArticle);
    await this.userRepository.save(user);

    return {
      message: hasLike ? "Article Un liked." : "Article Liked.",
      likesCount: mainArticle.likedBy.length,
    };
  }
}
