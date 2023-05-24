import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, PrismaService],
})
export class AuthorsModule { }
