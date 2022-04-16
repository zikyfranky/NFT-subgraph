# Generic NFT standard subgraph

> All ERC721/ERC1155 NFTs in one subgraph

More about subgraphs and The Graph protocol you can find [here](https://youtu.be/jxhNsSicEzA) and [here](https://thegraph.com/docs/introduction).

### Deliverables for the NFT subgraph:

- Query created NFTs by address
- Query owned NFTs by address
- Query NFT metadata by NFT

And having an open GitHub so anyone can PR new smart contracts associated with those platforms.

Can be deployed to any supported network, change the `network:` parameter in `subgraph.yaml` to one of the following:

```
1. Ethereum Mainnet -> mainnet
2. Kovan -> kovan
3. Rinkeby -> rinkeby
4. Ropsten -> ropsten
5. Goerli -> goerli
6. POA-Core -> poa-core
7. POA-Sokol -> poa-sokol
8. xDAI -> xdai
9. Matic -> matic
10. Mumbai (Matic’s testnet) -> mumbai
11. Fantom -> fantom
12. Binance Smart Chain -> bsc
13. Binance Smart Chain Testnet -> chapel
14. Clover -> clover
15. Avalanche -> avalanche
16. Celo -> celo
17. Celo's testnet (Alfajores) -> celo-alfajores
18. Fuse -> fuse
19. Moonbeam -> mbase
20. Arbitrum Testnet -> arbitrum-testnet-v5
21. Arbitrum One -> arbitrum-one
```

Instructions:

1. install dependencies with npm:
   `npm install`
   or with yarn
   `yarn`

2. authenticate within the cli:
   `graph auth --product hosted-service <ACCESS_TOKEN>`

3. build the graph
   `graph codegen && graph build`

4. deploy
   `graph deploy <ACCESS_TOKEN>`

## Useful resources

- [The Non-Fungible Token Bible](https://opensea.io/blog/guides/non-fungible-tokens/)
- [ERC-721 spec](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md)
- [ERC-1155 spec](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md)
