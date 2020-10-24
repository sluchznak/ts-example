import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { Container } from 'typedi';
import { initContainer } from './container';

const PORT = process.env.PORT || 4000;

export const bootstrap = async (): Promise<void> => {
  await initContainer();
  const server = new ApolloServer({
    schema: Container.get<GraphQLSchema>('schema'),
    playground: true,
  });

  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
};

bootstrap().catch((error) => {
  console.error(`Something wrong in bootstrap: ${error}`);
  process.exit(1);
});
