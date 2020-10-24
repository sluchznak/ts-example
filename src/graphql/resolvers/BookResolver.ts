import DataLoader from 'dataloader';
import { GraphQLError } from 'graphql';
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject } from 'typedi';
import { Author as AuthorInterface } from '../../Author';
import { AuthorsService } from '../../AuthorsService';
import { Book as BookInterface } from '../../Book';
import { BooksService } from '../../BooksService';
import { Author, Book, CreateBook } from '../types';

@Resolver(Book)
export class BookResolver {
  constructor(
    @Inject('authorsDataLoader')
    private readonly authorsDataLoader: DataLoader<number, AuthorInterface>,
    @Inject('booksService')
    private readonly booksService: BooksService,
    @Inject('authorsService')
    private readonly authorsService: AuthorsService,
  ) {}

  @Query(() => [Book])
  async books(): Promise<BookInterface[]> {
    return this.booksService.list();
  }

  @Mutation(() => Book)
  async createBook(
    @Arg('data') newBookData: CreateBook,
  ): Promise<BookInterface> {
    const author = await this.authorsService.getById(newBookData.authorId);
    if (!author) {
      throw new GraphQLError('Author with specified "authorId" isn\'t exist');
    }

    return this.booksService.create(
      newBookData.name,
      newBookData.pageCount,
      newBookData.authorId,
    );
  }

  @FieldResolver(() => Author)
  author(@Root() book: Book): Promise<AuthorInterface> {
    return this.authorsDataLoader.load(book.authorId);
  }
}
