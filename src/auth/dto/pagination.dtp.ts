import {IsInt} from "class-validator";

export class PaginationDto {
    @IsInt()
    pageNumber: number;
    @IsInt()
    limit: number;
}