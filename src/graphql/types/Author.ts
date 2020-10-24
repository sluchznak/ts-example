import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Author {
  @Field(() => Int)
  authorId: number;

  @Field()
  name: string;
}
