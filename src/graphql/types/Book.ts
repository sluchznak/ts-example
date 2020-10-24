import { Field, Int, ObjectType } from 'type-graphql';
import { Author } from './Author';

@ObjectType()
export class Book {
  @Field(() => Int)
  bookId: number;

  @Field()
  name: string;

  @Field(() => Int)
  pageCount: number;

  @Field(() => Int)
  authorId: number;

  @Field(() => Author)
  author: Author;
}
