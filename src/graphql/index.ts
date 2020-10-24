import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { AuthorResolver, BookResolver } from './resolvers';

export const schema = async (): Promise<GraphQLSchema> =>
  buildSchema({
    validate: false,
    resolvers: [BookResolver, AuthorResolver],
    container: Container,
  });
