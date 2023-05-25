import {
  Length,
  IsString,
  IsNotEmpty,
  Min,
  Max,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(0)
  price: number;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  authorId: string;
}
