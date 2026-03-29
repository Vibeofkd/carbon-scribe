import { Injectable, Logger } from '@nestjs/common';\nimport { ConfigService } from '../config/config.service';\nimport * as StellarSdk from '@stellar/stellar-sdk';\nimport { StrKey } from '@stellar/stellar-sdk';

@Injectable()
export class SorobanService {
  private readonly logger = new Logger(SorobanService.name);
  private readonly rpc: StellarSdk.rpc.Server;

  constructor(private readonly configService: ConfigService) {
    const stellarConfig = this.configService.getStellarConfig();
    // Assuming a Soroban RPC URL is available in config
    this.rpc = new StellarSdk.rpc.Server(
      stellarConfig.sorobanRpcUrl || 'https://soroban-testnet.stellar.org',
    );
  }

  /**
   * Fetches events for a specific contract from a given start ledger
   */
  async getContractEvents(
    contractId: string,
    startLedger: number,
  ): Promise<any[]> {
    try {
      this.logger.debug(
        `Fetching events for contract ${contractId} from ledger ${startLedger}`,
      );

      const response = await this.rpc.getEvents({
        startLedger,
        filters: [
          {
            type: 'contract',
            contractIds: [contractId],
          },
        ],
      });

      return response.events || [];
    } catch (error) {
      this.logger.error(`Failed to fetch Soroban events: ${error.message}`);
      return [];
    }
  }

  /**
   * Decodes ScVal from XDR into native Javascript types
   */
  decodeScVal(scVal: any): any {\n    try {\n      // In @stellar/stellar-sdk, scVal is often already decoded or provided as XDR\n      // We use StellarSdk.scValToNative for the conversion\n      return StellarSdk.scValToNative(scVal);\n    } catch (error) {\n      this.logger.warn(`Failed to decode ScVal: ${error.message}`);\n      return scVal;\n    }\n  }\n\n  async invokeFunction(\n    contractId: string,\n    method: string,\n    params: any[],\n    adminSecretKey: string,\n  ): Promise<{ txHash: string; cost: number }> {\n    try {\n      const sourceKeypair = StrKey.fromSecretKey(adminSecretKey);\n      const sourceAccount = new StellarSdk.Account(sourceKeypair.publicKey(), '0');\n      const contract = new StellarSdk.Contract(contractId);\n      const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {\n        fee: '100',\n        networkPassphrase: this.configService.getStellarConfig().network === 'public' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET,\n      })\n        .addOperation(contract.call(method, ...params))\n        .setTimeout(30);\n      const tx = txBuilder.build();\n\n      const prepared = await this.rpc.prepareTransaction(tx.toXDR().toString('base64'), StellarSdk.BASE_FEE);\n\n      const signedTx = StellarSdk.TransactionBuilder.signWithKeypair(prepared, sourceKeypair);\n      const sendResult = await this.rpc.sendTransaction(signedTx.toXDR().toString('base64'));\n\n      this.logger.log(`Tx submitted: ${sendResult.results[0].hash} cost: ${sendResult.cost}`);\n\n      return {\n        txHash: sendResult.results[0].hash,\n        cost: parseInt(sendResult.cost),\n      };\n    } catch (error) {\n      this.logger.error(`Invoke failed: ${error.message}`, error);\n      throw error;\n    }\n  }\n\n  async simulateInvoke(contractId: string, method: string, params: any[]): Promise<any> {\n    const sourceAddress = StellarSdk.Keypair.random().publicKey();\n    const sourceAccount = new StellarSdk.Account(sourceAddress, '0');\n    const contract = new StellarSdk.Contract(contractId);\n    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {\n      fee: '100',\n      networkPassphrase: this.configService.getStellarConfig().network === 'public' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET,\n    })\n      .addOperation(contract.call(method, ...params))\n      .setTimeout(30);\n    const tx = txBuilder.build();\n    const sim = await this.rpc.simulateTransaction(tx.toXDR().toString('base64'));\n    return sim.results[0].retval ? StellarSdk.scValToNative(sim.results[0].retval) : null;\n  }\n\n  private get configService() {\n    return this._configService;\n  }\n}
