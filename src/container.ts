import * as DataLoader from 'dataloader';
import { Container } from 'typedi';
import { createConnection } from 'typeorm';
import { AuthorsService } from './AuthorsService';
import { schema } from './graphql';
import './services/DbAuthorsService';
import './services/DbBooksService';

export const initContainer = async (): Promise<void> => {
  const connection = await createConnection();
  Container.set('dbConnection', connection);

  const authorsService = Container.get<AuthorsService>('authorsService');

  Container.set(
    'authorsDataLoader',
    new DataLoader(authorsService.getByIds.bind(authorsService)),
  );

  Container.set('schema', await schema());
};
