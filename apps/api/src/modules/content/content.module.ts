import { Module } from '@nestjs/common';

import { CategoryController } from './controllers/category.controller';
import { PostController } from './controllers/post.controller';
import { ContentService } from './services/content.service';

@Module({
  controllers: [PostController, CategoryController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
