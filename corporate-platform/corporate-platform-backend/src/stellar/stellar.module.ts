import { Module, forwardRef } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { TransferService } from './transfer.service';
import { StellarController } from './stellar.controller';
import { SorobanService } from './soroban.service';
import { OwnershipEventListener } from './soroban/events/ownership-event.listener';
import { MethodologyLibraryService } from './soroban/contracts/methodology-library.service';\nimport { CarbonAssetService } from './contracts/carbon-asset.service';\nimport { RetirementTrackerService } from './contracts/retirement-tracker.service';\nimport { OwnershipHistoryModule } from '../audit/ownership-history/ownership-history.module';

@Module({
  imports: [forwardRef(() => OwnershipHistoryModule)],
  controllers: [StellarController],
  providers: [\n    StellarService,\n    TransferService,\n    SorobanService,\n    OwnershipEventListener,\n    MethodologyLibraryService,\n    CarbonAssetService,\n    RetirementTrackerService,\n  ],
  exports: [\n    StellarService,\n    TransferService,\n    SorobanService,\n    OwnershipEventListener,\n    MethodologyLibraryService,\n    CarbonAssetService,\n    RetirementTrackerService,\n  ],
})
export class StellarModule {}
