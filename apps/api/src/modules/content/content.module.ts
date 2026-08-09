import { Module } from '@nestjs/common';

import { AdminContentController } from './controllers/admin-content.controller';
import { CategoryController } from './controllers/category.controller';
import { PostController } from './controllers/post.controller';
import { ContentService } from './services/content.service';

@Module({
  controllers: [PostController, CategoryController, AdminContentController],
  providers: [ContentService],
})
export class ContentModule {}
