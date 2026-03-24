import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditQueryDto } from './dto/credit-query.dto';
import { CreditUpdateDto } from './dto/credit-update.dto';
import { CompanyId } from '../shared/decorators/company-id.decorator';

@Controller('api/v1/credits')
export class CreditController {
  constructor(private readonly service: CreditService) {}

  @Get()
  async list(@Query() query: CreditQueryDto, @CompanyId() companyId?: string) {
    return this.service.list(query, companyId);
  }

  @Get('available')
  async available(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @CompanyId() companyId?: string,
  ) {
    return this.service.listAvailable(Number(page), Number(limit), companyId);
  }

  @Get('filters')
  async filters() {
    // return available filter options
    return {
      methodologies: await Promise.resolve([]),
      countries: await Promise.resolve([]),
      vintages: await Promise.resolve([]),
    };
  }

  @Get('stats')
  async stats() {
    return this.service.stats();
  }

  @Get('comparison')
  async comparison(
    @Query('projectIds') projectIds: string,
    @CompanyId() companyId?: string,
  ) {
    const ids = projectIds ? projectIds.split(',') : [];
    return this.service.compare(ids, companyId);
  }

  @Get(':id')
  async get(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.service.getById(id, companyId);
  }

  @Get(':id/quality')
  async quality(@Param('id') id: string, @CompanyId() companyId?: string) {
    return this.service.getQuality(id, companyId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: CreditUpdateDto,
    @CompanyId() companyId?: string,
  ) {
    return this.service.updateStatus(
      id,
      dto.status,
      dto.availableAmount,
      companyId,
    );
  }
}
