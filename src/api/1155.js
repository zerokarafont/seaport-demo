import { convertIPFStoHTTP } from '../utils/helper';
import { lambda, opensea, moralis } from '../utils/request'

export async function get1155Order() {
    return lambda.get('/order1155/get')
}

export async function get1155List(params = {}) {
    // const { address = '0xa29b704A0fC0E61dFB4F3FFeB051D0831FA5643A' } = params;
    const { address = '0x5D69dC7Ad884aDc41Ccb31EB42AaA7F252dEA445' } = params;

    const openseaData = await opensea.get('/assets', {
        params: {
            owner: address,
            include_orders: false
        }
    })
    console.log('opensea', openseaData)
    const moralisData = await moralis.get(`/${address}/nft`, {
        params: {
            chain: 'rinkeby'
        }
    })
    console.log('moralis', moralisDasta)
    if (openseaData && Array.isArray(openseaData.assets) && openseaData.assets.length) {
        return openseaData.assets.filter(item => item.asset_contract?.schema_name === 'ERC1155').map(item => ({
            cover: convertIPFStoHTTP(item.image_url),
            name: item.name,
            tokenId: item.token_id,
            contract: item.asset_contract?.address
        }))
    }

    if (moralisData && Array.isArray(moralisData.result) && moralisData.result.length) {
        return moralisData.result.filter(item => item.contract_type === 'ERC1155').map(item => ({
            cover: convertIPFStoHTTP(item.metadata ? JSON.parse(item.metadata).image : ''),
            name: item.metadata ? JSON.parse(item.metadata).name : '',
            tokenId: item.token_id,
            contract: item.token_address
        }))
    }

    return []
}

export async function get1155Detail(params) {
    const test = {
        address: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
        id: '77050028714196396548356251162258811078281013604627064601673797150155655348234'
    }
    const { contract_address = test.address , token_id = test.id } = params;

    return lambda.get(`/order1155/get/${contract_address}/${token_id}`)
}