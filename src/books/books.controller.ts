import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksServices: BooksService) { }

  @Get('/')
  getAll(): any {
    return this.booksServices.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    const book = await this.booksServices.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Delete('/:id')
  async deleteBook(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    if (!(await this.booksServices.getById(id)))
      throw new NotFoundException('Book not found!');
    await this.booksServices.deleteBook(id);
    return { success: true };
  }

  @Post('/')
  createBook(@Body() bookData: CreateBookDTO) {
    return this.booksServices.createBook(bookData);
  }

  @Put('/:id')
  async updateBook(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.booksServices.getById(id)))
      throw new NotFoundException('Book not found!');
    await this.booksServices.updateBook(id, bookData);
    return { success: true };
  }
}
