import { ConflictException, Injectable } from '@nestjs/common';
import { Book, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) { }

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: { author: true },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public deleteBook(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async createBook(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      if (error.code === 'P2025')
        throw new ConflictException("Author doesn't exist");
      throw error;
    }
  }

  public async updateBook(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return await this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      if (error.code === 'P2025')
        throw new ConflictException("Author doesn't exist");
      throw error;
    }
  }

  public async bookLike(bookId: Book['id'], userId: User['id']): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        where: { id: bookId },
        data: {
          users: {
            create: {
              user: {
                connect: { id: userId },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('You already liked this book');
      if (error.code === 'P2025')
        throw new ConflictException("Book doesn't exist");
      throw error;
    }
  }
}
