import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateAuthor {
  @Field()
  name: string;
}
