import { Author } from './Author';

export interface AuthorsService {
  getById(authorId: number): Promise<Author | null>;
  getByIds(authorIds: number[]): Promise<Author[]>;
  create(name: string): Promise<Author>;
}
