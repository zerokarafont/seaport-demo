import { Seaport } from '@opensea/seaport-js'
import { ethers } from 'ethers'
import ERC721 from '../abi/ERC721.json'
import ERC1155 from '../abi/ERC1155.json'

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

export async function amountsNFTInMyWallet(params) {
    const { type, contract_address, token_id, account } = params

    let contract, balance = 0
    if (type === 'ERC721') {
        contract = new ethers.Contract(contract_address, ERC721, provider)
        balance = await contract.balanceOf(account)
    } else if (type === 'ERC1155') {
        contract = new ethers.Contract(contract_address, ERC1155, provider)
        balance = await contract.balanceOf(account, token_id)
    } else {
        throw new Error('wrong nft type')
    }

    console.log('balance', balance)

    return balance.toNumber() ?? 0
}