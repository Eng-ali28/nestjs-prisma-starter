import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateImageTypePipe implements PipeTransform {
    private whitelist = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];

    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!file) return;
        if (!this.whitelist.includes(file.mimetype)) throw new BadRequestException('File must be image file');

        return file;
    }
}
