import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {PaginationDto} from './dto/pagination.dtp';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {
    }

    async getPaginatedProducts(paginationDto: PaginationDto) {
        const {pageNumber, limit} = paginationDto;

        const skip = (pageNumber - 1) * limit;

        const totalItems = await this.prisma.products.count();

        const products = await this.prisma.products.findMany({
            where: {
                OR: [
                    {delete_at: null},
                    {delete_at: ''}
                ]
            },
            skip,
            take: limit,
        })
        const totalPages = Math.ceil(totalItems / limit);
        return {
            pagination: {
                pageNumber,
                limit,
                totalPages,
                totalItems,
            },
            items: products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                created_at: product.created_at,
                updated_at: product.updated_at,
                categories: products.map(category => ({
                    id: category.id,
                    name: category.name,
                }))
            })),
        };
    }
}
