import { Transfer } from '../generated/templates/NftContract/ERC721'
import { Nft, NftContract } from '../generated/schema'
import { fetchName, fetchSymbol, handleTransfer } from './mapping'
import { SuperRare } from '../generated/SuperRare/SuperRare'
import { SuperRareV2 } from '../generated/SuperRareV2/SuperRareV2'
import { SUPERRARE, SUPERRARE_V2, ZERO_ADDRESS } from './constants'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'

export function handleTransferErc721 (event: Transfer): void {
  let address = event.address.toHexString()
  if (NftContract.load(address) == null) {
    let nftContract = new NftContract(address)
    nftContract.name = fetchName(event.address)
    nftContract.symbol = fetchSymbol(event.address)
    nftContract.save()
  }

  handleTransfer(event)

  let id = address + '/' + event.params.id.toString()
  let nft = Nft.load(id)
  if (nft.creatorAddress == null) {
    nft.creatorAddress = event.params.to
    nft.save()
  }
}
