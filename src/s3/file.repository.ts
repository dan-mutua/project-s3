import { EntityRepository, Repository } from 'typeorm';
import { File } from './file.entity';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  async upload(file: File): Promise<File> {
    return await this.save(file);
  }

  // async getFileById(id: number): Promise<File> {
  //   return await this.findOne(id);
  // }

  async deleteFile(id: number): Promise<void> {
    await this.delete(id);
  }
}
