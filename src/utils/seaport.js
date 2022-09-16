import { Seaport } from '@opensea/seaport-js'
import { ethers } from 'ethers'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export const seaport = new Seaport(provider)

// ConsiderationEnums.sol => ItemType

export const ItemType  = {
    // 0: ETH on mainnet, MATIC on polygon, etc.
    NATIVE: 0,

    // 1: ERC20 items (ERC777 and ERC20 analogues could also technically work)
    ERC20: 1,

    // 2: ERC721 items
    ERC721: 2,

    // 3: ERC1155 items
    ERC1155: 3,

    // 4: ERC721 items where a number of tokenIds are supported
    ERC721_WITH_CRITERIA: 4,

    // 5: ERC1155 items where a number of ids are supported
    ERC1155_WITH_CRITERIA: 5
}