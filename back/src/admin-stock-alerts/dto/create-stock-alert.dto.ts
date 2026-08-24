import { IsInt, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AlertType, AlertStatus } from '../entities/stock-alert.entity';

export class CreateStockAlertDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsEnum(AlertType)
  alertType: AlertType;

  @IsInt()
  currentQty: number;

  @IsInt()
  thresholdQty: number;

  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus;
}
