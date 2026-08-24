import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminStockAdjustmentsService } from './admin-stock-adjustments.service';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock-adjustment.dto';

@Controller('admin/stock-adjustments')
export class AdminStockAdjustmentsController {
  constructor(
    private readonly saService: AdminStockAdjustmentsService,
  ) {}

  @Post()
  create(@Body() dto: CreateStockAdjustmentDto) {
    return this.saService.create(dto);
  }

  @Get()
  findAll() {
    return this.saService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockAdjustmentDto,
  ) {
    return this.saService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.saService.remove(id);
  }
}
