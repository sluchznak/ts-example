import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from './Author';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  bookId: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  pageCount: number;

  @Column({ type: 'int' })
  authorId: number;

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn({ name: 'authorId' })
  author: number;
}
