import {ProductsService} from "./products.service";


export class ProductsController {
    constructor(private readonly authService: ProductsService) {
    }


}
