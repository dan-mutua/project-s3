import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  s3ClientConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };

  async uploadFile(file: Express.Multer.File): Promise<File> {
    const s3Client = new S3Client(this.s3ClientConfig);
    const key = `${uuidv4()}.${file.originalname.split('.').pop()}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    });

    await s3Client.send(command);

    const fileEntity = new File();
    fileEntity.key = key;
    fileEntity.originalName = file.originalname;
    fileEntity.mimetype = file.mimetype;
    fileEntity.size = file.size;

    await this.fileRepository.save(fileEntity);

    return fileEntity;
  }

  // async getFile(id: number): Promise<File> {
  //   return this.fileRepository.findOneOrFail(id);
  // }

  //   async getFileStream(key: string): Promise<Readable> {
  //     const getObjectCommand = new GetObjectCommand({
  //       Bucket: process.env.AWS_BUCKET_NAME,
  //       Key: key,
  //     });
  //     const { Body } = await this.s3Client.send(getObjectCommand);
  //     if (!Body) {
  //       throw new Error('Unable to get file stream from S3');
  //     }
  //     const readableStream = Readable.from(Body);
  //     return readableStream;
  //   }
  //   async downloadFile(key: string): Promise<NodeJS.ReadableStream> {
  //     const s3Client = new S3Client(this.s3ClientConfig);
  //     const command = new GetObjectCommand({
  //       Bucket: process.env.AWS_BUCKET_NAME,
  //       Key: key,
  //     });

  //     const response = await s3Client.send(command);
  //     return response.Body;
  //   }
}
