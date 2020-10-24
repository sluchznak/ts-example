import { Inject, Service } from 'typedi';
import { Connection } from 'typeorm';
import { Book } from '../Book';
import { BooksService } from '../BooksService';
import { Book as DbBook } from '../db/entities/Book';

@Service('booksService')
export class DbBooksService implements BooksService {
  constructor(
    @Inject('dbConnection')
    private readonly connection: Connection,
  ) {}

  async list(): Promise<Book[]> {
    return this.connection.manager.find<Book>(DbBook);
  }

  async create(
    name: string,
    pageCount: number,
    authorId: number,
  ): Promise<Book> {
    const newBook = this.connection.manager.create(DbBook, {
      name,
      pageCount,
      authorId,
    });
    return this.connection.manager.save(newBook);
  }
}
