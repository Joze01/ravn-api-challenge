import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';

@Module({
  controllers: [AppController],
  providers: [AppService, ProductsService],
  imports: [AuthModule, ProductsModule],
})
export class AppModule {}
