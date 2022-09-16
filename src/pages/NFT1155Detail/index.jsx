import { Layout, Image, Card, Space, Button, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { get1155Detail } from '../../api/1155'
import { IsNftExistInWallet } from '../../api/mime'
import { seaport , ItemType } from '../../utils/seaport'
import { ethers } from 'ethers'
import styles from './index.module.css'

export const NFT1155Detail = () => {
    const { contract, token_id } = useParams()
    const { address } = useAccount()


    const [data, setData] = useState([])
    const [isExistInWallet, setIsExist] = useState(false)

    const createBuyOrder = async (record) => {
        const offerer = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
        const fulfiller = "0xf1AC2D21C807927053b9ac0515C4804b2574a539";
        console.log('myAddress', address)
        const { executeAllActions } = await seaport.createOrder(
            {
                offer: [
                    {
                        // itemType: ItemType.NATIVE,
                        // Rinkeby WETH
                        token: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
                        amount: ethers.utils.parseEther("0.001").toString(),
                    },
                ],
                consideration: [
                    {
                        itemType: ItemType.ERC1155,
                        // https://testnets.opensea.io/assets/rinkeby/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/109311605693038500578730541108267070796871643983137481740982069696697607389194
                        token: "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
                        identifier: "109311605693038500578730541108267070796871643983137481740982069696697607389194",
                        recipient: address,
                        
                    },
                ],
            },
            address
        );

        const order = await executeAllActions();

        const { executeAllActions: executeAllFulfillActions } =
            await seaport.fulfillOrder({
                order,
                accountAddress: fulfiller,
            });

        const transaction = executeAllFulfillActions();
        console.log('transcation', transaction)
    }

    const handleBuy = async (record) => {
        try {
            await createBuyOrder(record)
        } catch(err) {
            message.error(err.message)
            console.error(err)
        }
    }

    const fetchData = async () => {
        // const data = await get1155Detail({
        //     contract_address: contract,
        //     token_id
        // })
        const data = await get1155Detail({})
        setData(data)
        console.log('data', data)
    }

    const isNFTExistInWallet = async () => {
        const res = await IsNftExistInWallet(contract, token_id, address)
        setIsExist(res)
    }

    useEffect(() => {
        isNFTExistInWallet()
    }, [address])

    useEffect(() => { }, [
        // fetchData()
    ])

    const columns = [{
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        render: (price) => `${price} ETH`
    }, {
        key: 'price',
        title: 'USD Price',
        dataIndex: 'price',
        render: (_, { price }) => '$' + `${price * 1608}`
    }, {
        key: 'price',
        title: 'Expiration',
        dataIndex: 'expire',
        render: (time) => time
    }, {
        key: 'price',
        title: 'From',
        dataIndex: 'from',
    }, {
        key: 'action',
        render: (_, record) => record.from === address ? null : <Button onClick={() => handleBuy(record)}>Buy</Button>
    }]

    const mockData = [{
        price: 10.22,
        expire: '30 days',
        from: '0x202b01344aF9b0349817C0df98Ec8d78491d2478'
    }]

    return (
        <Layout>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <div className={styles.title}>HElix 1155 test</div>
                <div className={styles.img}><Image src="https://i.seadn.io/gae/9u7gYMgKSJ-fT-KYMPaZtQKjFBjRkGrYSDXg1eVXNwQs-iXb3xAKUeWvGd8wbEerYbUhuJCqx4NKp0-i7CRFbDsRH2nNicyIkp9Smiw?w=500&auto=format" /></div>
                <Card title="Sale ends October 10, 2022 at 7:55pm GMT+8 ">
                    <h1>0.0001ETH</h1>
                    <Space>
                        <Button type='primary' onClick={handleBuy}>Buy now</Button>
                        <Button>Make offer</Button>
                        {isExistInWallet ? <Button>Sell</Button> : null}
                    </Space>
                </Card>
                <Table columns={columns} dataSource={mockData} pagination={false} />
            </Space>
        </Layout>
    )
} 