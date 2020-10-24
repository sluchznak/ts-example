import { graphql, GraphQLSchema } from 'graphql';
import { Container } from 'typedi';
import { Connection, QueryRunner } from 'typeorm';
import { initContainer } from '../src/container';

let queryRunner: QueryRunner;

beforeAll(async () => {
  await initContainer();
  await Container.get<Connection>('dbConnection').dropDatabase();
  await Container.get<Connection>('dbConnection').synchronize();
  queryRunner = Container.get<Connection>('dbConnection').createQueryRunner();
});

beforeEach(async () => {
  await queryRunner.startTransaction();
});

afterEach(async () => {
  await queryRunner.rollbackTransaction();
});

describe('mutations', () => {
  it('should create author', async () => {
    const query = `mutation createAuthor($name: String!) { createAuthor(data: { name: $name }) { name } }`;
    const result = await graphql(
      Container.get<GraphQLSchema>('schema'),
      query,
      {},
      {},
      { name: 'testauthor' },
    );
    expect(result.data.createAuthor.name).toBe('testauthor');
  });

  it('should throw error for unavailable author', async () => {
    const query = `mutation createBook($name: String!, $pageCount: Int!, $authorId: Int!) {
      createBook(data: { name: $name, pageCount: $pageCount, authorId: $authorId }) {
        name
        pageCount
        authorId
      }
    }`;
    const result = await graphql(
      Container.get<GraphQLSchema>('schema'),
      query,
      {},
      {},
      { name: 'Test book', pageCount: 234, authorId: 123 },
    );
    expect(result.errors[0].message).toBe(
      'Author with specified "authorId" isn\'t exist',
    );
  });

  it('should create book', async () => {
    const query = `mutation createBook($name: String!, $pageCount: Int!, $authorId: Int!) {
      createBook(data: { name: $name, pageCount: $pageCount, authorId: $authorId }) {
        name
        pageCount
        authorId
      }
    }`;
    await Container.get<Connection>(
      'dbConnection',
    ).query('INSERT INTO authors("authorId", "name") VALUES (?, ?)', [
      123,
      'Test Author',
    ]);
    const result = await graphql(
      Container.get<GraphQLSchema>('schema'),
      query,
      {},
      {},
      { name: 'Test book', pageCount: 234, authorId: 123 },
    );
    expect(result.data.createBook.name).toBe('Test book');
    expect(result.data.createBook.pageCount).toBe(234);
    expect(result.data.createBook.authorId).toBe(123);
  });
});

describe('queries', () => {
  const seed = async () => {
    await Container.get<Connection>(
      'dbConnection',
    ).query('INSERT INTO authors("authorId", "name") VALUES (?, ?)', [
      222,
      'Test Author',
    ]);
    await Container.get<Connection>(
      'dbConnection',
    ).query(
      'INSERT INTO books("bookId", "name", "pageCount", "authorId") VALUES (?, ?, ?, ?)',
      [12, 'Test BOOK', 333, 222],
    );
  };

  it('query books', async () => {
    await seed();

    const query = `{
      books {
        bookId
        name
        pageCount
        authorId
      }
    }`;
    const result = await graphql(Container.get<GraphQLSchema>('schema'), query);
    expect(result.data.books[0].bookId).toBe(12);
    expect(result.data.books[0].name).toBe('Test BOOK');
    expect(result.data.books[0].pageCount).toBe(333);
    expect(result.data.books[0].authorId).toBe(222);
  });

  it('query books with nested author', async () => {
    await seed();

    const query = `{
      books {
        bookId
        name
        pageCount
        author {
          authorId
          name
        }
      }
    }`;
    const result = await graphql(Container.get<GraphQLSchema>('schema'), query);
    expect(result.data.books[0].bookId).toBe(12);
    expect(result.data.books[0].name).toBe('Test BOOK');
    expect(result.data.books[0].pageCount).toBe(333);
    expect(result.data.books[0].author.authorId).toBe(222);
    expect(result.data.books[0].author.name).toBe('Test Author');
  });
});
