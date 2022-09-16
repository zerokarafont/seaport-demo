import { moralis, opensea, lambda } from '../utils/request'

export async function IsNftExistInWallet(contract_address, token_id, wallet_address) {
    const metadata = await moralis.get(`/nft/${contract_address}/${token_id}`)
    
    if (!metadata) {
        return false
    }

    if (metadata.owner_of === wallet_address) {
        return true
    }

    return false
}