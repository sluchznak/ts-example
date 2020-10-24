import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateBook {
  @Field()
  name: string;

  @Field(() => Int)
  pageCount: number;

  @Field(() => Int)
  authorId: number;
}
