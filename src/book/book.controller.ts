import { Controller, Get, Post, Body, Param, NotFoundException, HttpException, HttpStatus, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schema/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core'
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) { }

    @Get()
    async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
        return await this.bookService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createBook(
        @Body()
        book: CreateBookDto,
        @Req() req
    ): Promise<Book> {
        return await this.bookService.create(book, req.user);
    }

    @Get(':id')
    async getBook(
        @Param('id')
        id: string,
    ): Promise<Book> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new HttpException('Please enter correct id', HttpStatus.BAD_REQUEST);
        }

        const book = await this.bookService.findById(id);

        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
        return book

    }

    @Patch(':id')
    async updateBook(
        @Param('id')
        id: string,

        @Body()
        book: UpdateBookDto
    ): Promise<Book> {
        return await this.bookService.updateById(id, book)
    }

    @Delete(':id')
    async deleteBook(
        @Param('id')
        id: string
    ): Promise<Book> {
        return await this.bookService.deleteById(id)
    }
}
