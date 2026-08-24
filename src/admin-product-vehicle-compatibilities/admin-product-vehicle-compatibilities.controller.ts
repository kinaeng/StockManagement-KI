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
import { AdminProductVehicleCompatibilitiesService } from './admin-product-vehicle-compatibilities.service';
import { CreateProductVehicleCompatibilityDto } from './dto/create-product-vehicle-compatibility.dto';
import { UpdateProductVehicleCompatibilityDto } from './dto/update-product-vehicle-compatibility.dto';

@Controller('admin/product-vehicle-compatibilities')
export class AdminProductVehicleCompatibilitiesController {
  constructor(
    private readonly compatibilitiesService: AdminProductVehicleCompatibilitiesService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductVehicleCompatibilityDto) {
    return this.compatibilitiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.compatibilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.compatibilitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductVehicleCompatibilityDto,
  ) {
    return this.compatibilitiesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.compatibilitiesService.remove(id);
  }
}
