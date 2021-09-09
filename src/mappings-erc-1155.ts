import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  ERC1155,
  TransferBatch,
  TransferSingle,
  URI
} from '../generated/ERC1155/ERC1155'
import { ERC1155Metadata } from '../generated/ERC1155/ERC1155Metadata'
import { Nft } from '../generated/schema'
import { BIGINT_ZERO, ZERO_ADDRESS } from './constants'
import { updateOwnership, normalize, toBytes } from './mapping'

export function handleTransferSingle (event: TransferSingle): void {
  transferBase(
    event.address,
    event.params.from,
    event.params.to,
    event.params.id,
    event.params.value,
    event.block.timestamp
  )
}

export function handleTransferBatch (event: TransferBatch): void {
  if (event.params.ids.length != event.params.values.length) {
    throw new Error('Inconsistent arrays length in TransferBatch')
  }

  for (let i = 0; i < event.params.ids.length; i++) {
    let ids = event.params.ids
    let values = event.params.values
    transferBase(
      event.address,
      event.params.from,
      event.params.to,
      ids[i],
      values[i],
      event.block.timestamp
    )
  }
}

export function supportsInterfaceErc1155 (
    contract: ERC1155,
    interfaceId: String,
    expected: boolean = true
  ): boolean {
    let supports = contract.try_supportsInterface(toBytes(interfaceId))
    return !supports.reverted && supports.value == expected
  }

export function handleURI (event: URI): void {
  let id = event.address.toHexString() + '/' + event.params.id.toString()
  let nft = Nft.load(id)
  if (nft != null) {
    nft.tokenURI = event.params.value
    nft.save()
  }
}

function transferBase (
  contractAddress: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt,
  timestamp: BigInt
): void {
  let nftId = contractAddress.toHexString() + '/' + id.toString()
  let nft = Nft.load(nftId)
  if (nft == null) {
    let contract = ERC1155.bind(contractAddress)
    nft = new Nft(nftId)
    nft.contract = contractAddress.toHexString()
    nft.tokenID = id
    if (supportsInterfaceErc1155(contract, '0x0e89341c')) {
      let contractMetadata = ERC1155Metadata.bind(contractAddress)
      let metadataURI = contractMetadata.try_uri(id)
      if (!metadataURI.reverted) {
        nft.tokenURI = normalize(metadataURI.value)
      } else {
        nft.tokenURI = ''
      }
    } else {
      nft.tokenURI = ''
    }
    nft.creatorAddress = from
    nft.createdAt = timestamp
    nft.save()
  }

  if (to == ZERO_ADDRESS) {
    // burn token
    nft.removedAt = timestamp
    nft.save()
  }

  if (from != ZERO_ADDRESS) {
    updateOwnership(nftId, from, BIGINT_ZERO.minus(value))
  }
  updateOwnership(nftId, to, value)
}
