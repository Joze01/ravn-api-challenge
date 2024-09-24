import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import {AuthModule} from "../auth/auth.module";
import {ProductsController} from "./products.controller";

@Module({
})
@Module({
  imports: [
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {
}
