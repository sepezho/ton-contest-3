import { Cell, beginCell, Address } from "ton";

// encode contract storage according to save_data() contract method
export function data(params: { ownerAddress: Address; number: number; }): Cell {
  return beginCell().storeAddress(params.ownerAddress).storeUint(params.number, 64).endCell();
}

// message encoders for all ops (see contracts/imports/constants.fc for consts)

export function calculate(params: { payload: string }): Cell {
  return beginCell().storeUint(0x228cfdb9, 32).storeBuffer(Buffer.from(params.payload)).endCell();
}