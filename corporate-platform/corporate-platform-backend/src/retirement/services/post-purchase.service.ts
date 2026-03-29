import { Injectable, Logger } from '@nestjs/common';
import { CarbonAssetService } from '../../stellar/contracts/carbon-asset.service';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class PostPurchaseService {
  private readonly logger = new Logger(PostPurchaseService.name);

  constructor(\n    private readonly carbonAssetService: CarbonAssetService,\n    private readonly prisma: PrismaService,\n  ) {}

  async handleOrderCompleted(orderId: string) {
    try {
      this.logger.log(`Processing post-purchase for order: ${orderId}`);

      const prisma = this.prisma as any;
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: { credit: true },
          },
        },
      });

      if (!order) {
        this.logger.error(`Order ${orderId} not found`);
        return;
      }

      // Group credits by project or iterate through items
      for (const item of order.items) {
        // Trigger transfer for each item
        const companyWallet = 'GB_COMPANY_WALLET'; // Derive from company DB\n        await this.carbonAssetService.transfer(companyWallet, item.credit.id, BigInt(item.quantity));
      }

      this.logger.log(`Post-purchase transfer initiated for order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Error in post-purchase processing for order ${orderId}`,
        error,
      );
    }
  }
}
