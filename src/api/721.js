import { convertIPFStoHTTP } from '../utils/helper';
import { lambda, opensea, moralis, fetchMeta } from '../utils/request'
import * as bluebird from 'bluebird'

export async function get721List(params = {}) {
    const { address } = params;

    const openseaData = await opensea.get('/assets', {
        params: {
            owner: address,
            include_orders: false,
            // order_direction: 'asc'
        }
    })
    console.log('opensea', openseaData)
    const moralisData = await moralis.get(`/${address}/nft`, {
        params: {
            chain: 'rinkeby'
        }
    })
    console.log('moralis', moralisData)
    if (openseaData && Array.isArray(openseaData.assets) && openseaData.assets.length) {
        return openseaData.assets.filter(item => item.asset_contract?.schema_name === 'ERC721').map(item => ({
            cover: convertIPFStoHTTP(item.image_url),
            name: item.name,
            tokenId: item.token_id,
            contract: item.asset_contract?.address
        }))
    }

    // 不合理的请求，每个token_uri都需要预先请求一下， 如果数量过多会产生大量的并发请求
    if (moralisData && Array.isArray(moralisData.result) && moralisData.result.length) {
        const filteredItems = moralisData.result.filter(item => item.contract_type === 'ERC721')
        const fillMetaItems = await bluebird.map(filteredItems , async(item) => {
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
            contract: item.token_address
        }))
    }

    return []
}

export async function get721Orders(params) {
    const { contract_address, token_id } = params;

    return lambda.get(`/order/get/${contract_address}/${token_id}`)
}

export async function get721Detail(params) {
    const { contract_address, token_id } = params
    const data = {
        name: '',
        cover: '',
        listings: []
    }
    const openseaData = await opensea.get(`/asset/${contract_address}/${token_id}`)
    console.log('opensea', openseaData)
    const moralisData = await moralis.get(`/nft/${contract_address}/${token_id}`, {
        params: {
            chain: 'rinkeby'
        }
    })
    console.log('moralis', moralisData)
    if (openseaData) {
        data.name = openseaData.name
        data.cover = openseaData.image_url
    }
    if (moralisData) {
        if (moralisData.metadata) {
            data.name = JSON.parse(moralisData.metadata).name
            data.cover = JSON.parse(moralisData.metadata).image_url
        } else {
            const metadata = await fetchMeta(moralisData.token_uri)
            console.log('fetchMetaData', metadata)
            data.name = metadata?.name
            data.cover = metadata?.image_url
        }
    }

    const lambdaData = await lambda.get(`/order/get/${contract_address}/${token_id}`)
    if (lambdaData.name) {
        data.name = lambdaData.name
    }
    if (lambdaData.image_url) {
        data.cover = lambdaData.image_url
    }
    data.listings = lambdaData?.listings || []

    return data
}