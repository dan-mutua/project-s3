import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file): Promise<{ success: boolean }> {
    await this.fileService.uploadFile(file);
    return { success: true };
  }

  // @Get(':key')
  // async downloadFile(@Param('key') key: string, @Res() res): Promise<void> {
  //   const fileStream = await this.fileService.getFileStream(key);
  //   fileStream.pipe(res);
  // }
}
