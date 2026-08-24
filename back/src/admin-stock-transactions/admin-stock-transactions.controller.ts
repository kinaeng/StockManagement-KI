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
import { AdminStockTransactionsService } from './admin-stock-transactions.service';
import { CreateStockTransactionDto } from './dto/create-stock-transaction.dto';
import { UpdateStockTransactionDto } from './dto/update-stock-transaction.dto';

@Controller('admin/stock-transactions')
export class AdminStockTransactionsController {
  constructor(
    private readonly stService: AdminStockTransactionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateStockTransactionDto) {
    return this.stService.create(dto);
  }

  @Get()
  findAll() {
    return this.stService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockTransactionDto,
  ) {
    return this.stService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stService.remove(id);
  }
}
