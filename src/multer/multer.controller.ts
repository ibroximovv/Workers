import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('file')
export class MulterController {
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('File is required or not valid!');
    }

    const protocol = req.protocol; // http or https
    const host = req.get('host');  // e.g. 54.205.172.182:3000
    const fullUrl = `${protocol}://${host}/uploads/${file.filename}`;

    return {
      link: fullUrl,
    };
  }
}
