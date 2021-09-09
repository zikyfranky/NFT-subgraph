import { Address } from '@graphprotocol/graph-ts'
import {
  TransferSingle,
  TransferBatch,
  ERC1155
} from '../generated/ERC1155/ERC1155'
import { NftContract } from '../generated/schema'
import { fetchName, fetchSymbol } from './mapping'
import {
  handleTransferBatch,
  handleTransferSingle,
  handleURI,
  supportsInterfaceErc1155
} from './mappings-erc-1155'

export { handleURI }

export function handleTransferSingleErc1155 (event: TransferSingle): void {
  let address = event.address.toHexString()
  let contract = ERC1155.bind(event.address)
  let supportsEIP1155 = supportsInterfaceErc1155(contract, 'd9b67a26')

  if (!supportsEIP1155) {
    return
  }

  ensureNftContract(event.address)
  handleTransferSingle(event)
}

export function handleTransferBatchErc1155 (event: TransferBatch): void {
  ensureNftContract(event.address)
  handleTransferBatch(event)
}

function ensureNftContract (address: Address): void {
  if (NftContract.load(address.toHexString()) == null) {
    let nftContract = new NftContract(address.toHexString())
    nftContract.name = fetchName(address)
    nftContract.symbol = fetchSymbol(address)
    nftContract.save()
  }
}
