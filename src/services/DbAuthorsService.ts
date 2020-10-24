import { Inject, Service } from 'typedi';
import { Connection } from 'typeorm';
import { Author } from '../Author';
import { AuthorsService } from '../AuthorsService';
import { Author as DbAuthor } from '../db/entities';

@Service('authorsService')
export class DbAuthorsService implements AuthorsService {
  constructor(
    @Inject('dbConnection')
    private readonly connection: Connection,
  ) {}

  getById(authorId: number): Promise<Author | null> {
    return this.connection.manager.findOne<Author>(DbAuthor, authorId);
  }

  async getByIds(authorIds: number[]): Promise<Author[]> {
    return this.connection.manager.findByIds<Author>(
      DbAuthor,
      authorIds.sort(),
      {
        order: { authorId: 'ASC' },
      },
    );
  }

  async create(name: string): Promise<Author> {
    const newAuthor = this.connection.manager.create(DbAuthor, { name });
    return this.connection.manager.save(newAuthor);
  }
}
