import { Cell, beginCell, Address } from "ton";

// encode contract storage according to save_data() contract method
export function data(params: { ownerAddress: Address; number: number }): Cell {
  return beginCell().storeAddress(params.ownerAddress).storeUint(params.number, 64).endCell();
}

// message encoders for all ops (see contracts/imports/constants.fc for consts)

function bufferToChunks(buff: Buffer, chunkSize: number) {
  let chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize));
    buff = buff.slice(chunkSize);
  }
  return chunks;
}

export function makeSnakeCell(data: Buffer) {
  let chunks = bufferToChunks(data, 127);
  let rootCell = new Cell();
  let curCell = rootCell;

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];

    curCell.bits.writeBuffer(chunk);

    if (chunks[i + 1]) {
      let nextCell = new Cell();
      curCell.refs.push(nextCell);
      curCell = nextCell;
    }
  }

  return rootCell;
}


export function calculate(params: { payload: string }): Cell {
  let data = Buffer.from('8888'+params.payload);
  return makeSnakeCell(data);
  //  return encodeOffChainContent("8888" + params.payload);

 //return beginCell().storeUint(0x228cfdb9, 32).storeBuffer(data1).storeRef(makeSnakeCell(data).beginParse()).endCell();
}
