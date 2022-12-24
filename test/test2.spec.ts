import chai, { expect } from "chai";
import chaiBN from "chai-bn";
import BN from "bn.js";
chai.use(chaiBN(BN));

import { Cell, toNano } from "ton";
import { SmartContract } from "ton-contract-executor";
import * as main from "../contracts/main";
import { internalMessage, randomAddress } from "./helpers";

import { hex } from "../build/main.compiled.json";

describe("2params queue on TON Blockchain Test", () => {
  let contract: SmartContract;

  beforeEach(async () => {
    contract = await SmartContract.fromCell(
      Cell.fromBoc(hex)[0] as any, // code cell from build output
      main.data({
        ownerAddress: randomAddress("owner"),
      }) as any,
      {
        debug: true,
      }
    );
  });

  it("should not drop", async () => {
    // increment

    const sendIncrement = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: main.calculate({
          payload: "message_queue",
          score: 1,
          value: "0.1",
        }),
      }) as any
    );


    console.log(sendIncrement.logs);
    console.log(sendIncrement.gas_consumed);
  });
});
