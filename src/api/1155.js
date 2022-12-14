import { convertIPFStoHTTP } from '../utils/helper';
import { lambda, opensea, moralis, fetchMeta } from '../utils/request'
import * as bluebird from 'bluebird'

// export async function get1155Order() {
//     return lambda.get('/order1155/get')
// }

export async function get1155List(params = {}) {
    // const { address = '0x5D69dC7Ad884aDc41Ccb31EB42AaA7F252dEA445' } = params;
    // const { address = '0xA3C97E32428e8608D4bE4Dfbf3F196C1A7F1743B' } = params;
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
        return openseaData.assets.filter(item => item.asset_contract?.schema_name === 'ERC1155').map(item => ({
            cover: convertIPFStoHTTP(item.image_url),
            name: item.name,
            tokenId: item.token_id,
            contract: item.asset_contract?.address
        }))
    }

    // 不合理的请求，每个token_uri都需要预先请求一下， 如果数量过多会产生大量的并发请求
    if (moralisData && Array.isArray(moralisData.result) && moralisData.result.length) {
        const filteredItems = moralisData.result.filter(item => item.contract_type === 'ERC1155')
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
        // return moralisData.result.filter(item => item.contract_type === 'ERC1155').map(item => ({
        //         cover: convertIPFStoHTTP(item.metadata ? JSON.parse(item.metadata).image : ''),
        //         name: item.metadata ? JSON.parse(item.metadata).name : '',
        //         tokenId: item.token_id,
        //         contract: item.token_address
        //     }))
    }

    return []
}

export async function get1155Orders(params) {
    // const test = {
    //     address: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
    //     id: '77050028714196396548356251162258811078281013604627064601673797150155655348234'
    // }
    // const { contract_address = test.address , token_id = test.id } = params;
    const { contract_address, token_id } = params;

    return lambda.get(`/order1155/get/${contract_address}/${token_id}`)
}

export async function get1155Detail(params) {
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

    const lambdaData = await lambda.get(`/order1155/getListing/${contract_address}/${token_id}`)
    console.log('lambdaData', lambdaData)
    if (lambdaData.name) {
        data.name = lambdaData.name
    }
    if (lambdaData.image_url) {
        data.cover = lambdaData.image_url
    }
    data.listings = lambdaData?.listings || []

    return data
}