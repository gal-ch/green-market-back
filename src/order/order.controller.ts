import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'auth/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() { orderDetails, cardDetails }, req: any) {
    return await this.orderService.create(orderDetails, cardDetails, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: any) {
    const accountId = req.user.sub;
    return this.orderService.findAll({accountId});
  }

  @UseGuards(AuthGuard)
  @Post('getAllOrderByStore')
  async getAllOrderByStore(
    @Body()
    {
      startDate,
      endDate,
      filters,
    }: {
      startDate: string;
      endDate: string;
      filters: Record<string, number[]>;
    },
    @Req() req: any,
  ) {
    const accountId = req.user.sub;
    return this.orderService.getAllOrderByStore(
      startDate,
      endDate,
      filters,
      accountId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('exportReport')
  async exportReport(
    @Body()
    {
      storeId,
      startDate,
      endDate,
      filters,
    }: {
      storeId?: number;
      startDate: string;
      endDate: string;
      filters: Record<string, number[]>;
    },
    @Req() req: Request,
  ) {
    return this.orderService.exportReport(
      startDate,
      endDate,
      filters,
      req,
      +storeId,
    );
  }
}
