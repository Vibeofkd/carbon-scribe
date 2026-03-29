import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { SorobanService } from '../soroban.service';
import * as StellarSdk from '@stellar/stellar-sdk';
import { nativeToScVal } from '@stellar/stellar-sdk';

@Injectable()
export class CarbonAssetService {
  private readonly logger = new Logger(CarbonAssetService.name);
  private readonly contractId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly sorobanService: SorobanService,
  ) {
    this.contractId = this.configService.getStellarConfig().sorobanContracts.carbonAssetContractId;
  }

  async transfer(toAccount: string, tokenId: number, amount: bigint): Promise<{ txHash: string; cost: number }> {
    const adminSecretKey = this.configService.getStellarConfig().sorobanContracts.adminSecretKey;
    const params = [
      nativeToScVal(toAccount, { type: 'address' }),
      nativeToScVal(tokenId, { type: 'u32' }),
      nativeToScVal(amount, { type: 'u64' }),
    ];
    return this.sorobanService.invokeFunction(this.contractId, 'transfer', params, adminSecretKey);
  }

  async balance(account: string): Promise<bigint> {
    const params = [nativeToScVal(account, { type: 'address' })];
    const result = await this.sorobanService.simulateInvoke(this.contractId, 'balance', params);
    return BigInt(result);
  }
}

