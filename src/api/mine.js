import { moralis, opensea, lambda, fetchMeta } from '../utils/request'
import * as bluebird from 'bluebird'
import { convertIPFStoHTTP } from '../utils/helper'

export async function fetchMineWalletNFTs(account) {
    // opensea接口返回空?
    const openseaData = await opensea.get('/assets', {
        params: {
            owner: account
        }
    })

    if (openseaData && Array.isArray(openseaData.assets) && openseaData.assets.length) {
        return openseaData.assets.map(item => ({
            name: item.name,
            cover: item.image_url,
            tokenId: item.token_id,
            contract: item.asset_contract?.address,
            type: item.asset_contract?.schema_name // ERC721 || ERC1155
        }))
    }

    const moralisData = await moralis.get(`/${account}/nft`, {
        params: {
            chain: 'rinkeby'
        }
    })

    if (moralisData && Array.isArray(moralisData.result) && moralisData.result.length) {
        const fillMetaItems = await bluebird.map(moralisData.result , async(item) => {
            if (item.metadata) {
                return item
            }
            const metadata = await fetchMeta.get(item.token_uri)
            item.metadata = metadata
            return item
        }, { concurrency: 2 })

        return fillMetaItems.map(item => ({
            cover: convertIPFStoHTTP(typeof item.metadata === 'string' ? JSON.parse(item.metadata).image : item.metadata?.image),
            name: typeof item.metadata === 'string' ? JSON.parse(item.metadata).name : item.metadata?.name,
            tokenId: item.token_id,
            contract: item.token_address,
            type: item.contract_type
        }))
    }

    return []
}