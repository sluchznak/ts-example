import { Book } from './Book';

export interface BooksService {
  list(): Promise<Book[]>;
  create(name: string, pageCount: number, authorId: number): Promise<Book>;
}
