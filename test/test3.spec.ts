import chai, { expect } from "chai";
import chaiBN from "chai-bn";
import BN from "bn.js";
chai.use(chaiBN(BN));

import { Cell } from "ton";
import { SmartContract } from "ton-contract-executor";
import * as main from "../contracts/main";
import { internalMessage, randomAddress } from "./helpers";

import { hex } from "../build/main.compiled.json";

describe("Calculator on TON Blockchain Test", () => {
  let contract: SmartContract;

  beforeEach(async () => {
    contract = await SmartContract.fromCell(
      Cell.fromBoc(hex)[0] as any, // code cell from build output
      main.data({
        ownerAddress: randomAddress("owner"),
        number: 0,
      }) as any,
      {
        debug: true,
      }
    );
  });

  it("should not drop", async () => {
    const sendIncrement = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: main.calculate({
          payload: '5000/((15+17)*4+2)' // 38 
        }),
      }) as any,
      {
        gasLimits: {
          max: 99999999999999
        }
      }
    );
    const logs = sendIncrement.debugLogs
    const logsStatus = sendIncrement.type
    console.log(`\n---------------\n`);
    console.log(logsStatus);
    console.log(logs.reduce((a, b) => a+'\n'+b, ''));
    console.log(sendIncrement.gas_consumed);
    console.log(`\n---------------\n`);
  });
});
