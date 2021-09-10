import { Nft, Ownership, NftContract } from '../generated/schema'
import { Address, BigInt, store, Bytes } from '@graphprotocol/graph-ts'
import { BIGINT_ZERO, ZERO_ADDRESS, BIGINT_ONE } from './constants'
import {
  KittyCore,
  Approval as ApprovalEvent,
  Birth as BirthEvent,
  ContractUpgrade as ContractUpgradeEvent,
  Pregnant as PregnantEvent,
  Transfer as TransferEvent
} from '../generated/CryptoKitties/KittyCore'

import { updateOwnership, normalize, toBytes } from './mapping'
export function handleTransfer (event: TransferEvent): void {
  ensureNftContract(event.address)
  processTransfer(
    event.address,
    event.params.from,
    event.params.to,
    event.params.tokenId,
    BIGINT_ONE,
    event.block.timestamp
  )
}

export function handleApproval (event: ApprovalEvent): void {}

export function handleBirth (event: BirthEvent): void {}

export function handleContractUpgrade (event: ContractUpgradeEvent): void {}

export function handlePregnant (event: PregnantEvent): void {}

export function ensureNftContract (address: Address): void {
  if (NftContract.load(address.toHexString()) == null) {
    let contract = KittyCore.bind(address)
    let nftContract = new NftContract(address.toHexString())

    let name = contract.try_name()
    if (!name.reverted) {
      nftContract.name = normalize(name.value)
    } else {
      nftContract.name = ''
    }
    let symbol = contract.try_symbol()
    if (!symbol.reverted) {
      nftContract.symbol = normalize(symbol.value)
    } else {
      nftContract.symbol = ''
    }

    nftContract.type = 'CRYPTOKITTIES'
    nftContract.save()
  }
}

export function processTransfer (
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
    nft = new Nft(nftId)
    nft.contract = contractAddress.toHexString()
    nft.tokenID = id
    nft.tokenURI =
      'https://img.cryptokitties.co/' +
      contractAddress.toHexString() +
      '/' +
      id.toString() +
      '.shadow.svg'
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
