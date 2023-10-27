import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;
}
