import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  entityName: string;

  @IsInt()
  @IsOptional()
  entityId?: number;

  @IsString()
  @IsOptional()
  payload?: string;
}
