import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Author as AuthorInterface } from '../../Author';
import { AuthorsService } from '../../AuthorsService';
import { Author, CreateAuthor } from '../types';

@Resolver(Author)
export class AuthorResolver {
  constructor(
    @Inject('authorsService')
    private readonly authorsService: AuthorsService,
  ) {}

  @Mutation(() => Author)
  createAuthor(
    @Arg('data') newAuthorData: CreateAuthor,
  ): Promise<AuthorInterface> {
    return this.authorsService.create(newAuthorData.name);
  }
}
