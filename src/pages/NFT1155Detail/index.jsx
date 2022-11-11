import { Layout, Image, Card, Space, Button, Table, message, Spin, Modal, Form, InputNumber, Input, DatePicker } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { get1155Detail } from '../../api/1155';
import { amountsNFTInMyWallet } from '../../utils/seaport'
import { seaport, ItemType } from '../../utils/seaport';
import { ethers } from 'ethers';
import styles from './index.module.css';
import { useOrderBook } from '../../store/order';
import { save1155Order, cancelOrder, makeOffer } from '../../api/order'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

const { RangePicker } = DatePicker

export const NFT1155Detail = () => {
    const { contract, token_id } = useParams();
    const { address } = useAccount();

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({});
    const { orderBook, addOrder } = useOrderBook();
    const [availableAmounts, setAmounts] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refetch, setRefetch] = useState(false)

    const isExistInWallet = useMemo(() => availableAmounts > 0, [availableAmounts])
    const isCanBuy = useMemo(() => data.listings?.length > 0, [data.listings])

    const fetchData = async () => {
        setLoading(true)
        const data = await get1155Detail({
            contract_address: contract,
            token_id
        })
        setData(data);
        console.log('data', data);
        setLoading(false)
    };

    const judgeIsCanSell = async () => {
        const amounts = await amountsNFTInMyWallet({
            type: 'ERC1155',
            contract_address: contract,
            token_id: token_id,
            account: address
        })
        setAmounts(amounts)
    };

    useEffect(() => {
        judgeIsCanSell()
    }, [address]);

    useEffect(() => {
        fetchData()
    }, [refetch])

    // 完成上架
    const handleOk = async () => {
        const forms = await form.validateFields()
        const {
            amount,
            quantity,
            time: [startDate, endDate]
        } = forms;

        try {
            const hide = message.loading('waiting', 20000)
            // 创建卖单
            const order = await makingList({
                amount,
                quantity,
                startTime: moment(startDate).unix(),
                endTime: moment(endDate).unix()
            })

            const orderToSave = {
                id: uuidv4(),
                order,
                address: contract,
                token_id: token_id,
                listing: {
                    unitPrice: amount,
                    quantity: quantity,
                    duration: moment.duration(endDate.diff(startDate)).as('days'),
                    seller: address
                },
                considerations: Number(amount) * quantity,
                type: ItemType.ERC1155,
                image_url: data.cover,
                name: data.name
            }

            console.log('order', order)
            console.log('orderToSave', orderToSave)

            await save1155Order(orderToSave)

            hide()
            message.success('上架成功')
            setRefetch(!refetch)
        } catch (e) {
            console.error(e)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // 上架 / 卖
    const makingList = async (params) => {
        const { startTime, endTime } = params;
        const { executeAllActions } = await seaport.createOrder(
            {
                offer: [
                    {
                        itemType: ItemType.ERC1155,
                        token: contract,
                        identifier: token_id,
                        amount: params.quantity,
                        
                    },
                ],
                consideration: [
                    {
                        amount: ethers.utils.parseEther(params.amount).toString(),
                        recipient: address,
                    },
                ],
                startTime,
                endTime,
            },
            address
        );

        const makingListOrder = await executeAllActions();
        // addOrder('makingListOrder', makingListOrder);
        console.log('makingListOrder', makingListOrder);
        return makingListOrder
    };

    // 直接购买
    const handleBuy = async (order) => {
        console.log('orderBook', orderBook)
        const { executeAllActions } = await seaport.fulfillOrder({
            order: orderBook.makingListOrder,
            accountAddress: address,
        });
        const transcation = await executeAllActions();
        console.log('buyTranscation: ', transcation);
    };

    // 出价
    const makingOffer = async () => {
        try {
            const hide = message.loading('waiting', 20000)
            const { executeAllActions } = await seaport.createOrder(
                {
                    offer: [
                        {
                            amount: parseEther('0.002').toString(),
                            // Rinkeby WETH
                            token: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
                        },
                    ],
                    consideration: [
                        {
                            itemType: ItemType.ERC1155,
                            token: contract,
                            identifier: token_id,
                            recipient: address,
                        },
                    ],
                },
                address
            );
    
            const makingOfferOrder = await executeAllActions();
            
            console.log('出价单', makingOfferOrder)
    
            await makeOffer(makingOfferOrder)

            message.success('出价成功')

            hide()
        } catch (e) {
            console.error(e)
        }
    };

    // 接受出价
    const acceptOffer = async (order) => {
        const { executeAllActions } = await seaport.fulfillOrder({
            order: order || orderBook.makingOfferOrder,
            accountAddress: address,
        });
        const transaction = await executeAllActions();
        console.log('acceptTranscation: ', transaction);
    };

    // 取消挂单/出价
    const handleCancelOrder = async (data) => {
        try {
            const hide = message.loading('waiting...', 20000)
            const { orderId, order: { parameters } } = data
            const tx = await seaport.cancelOrders([parameters]).transact()
            await tx.wait()

            await cancelOrder(orderId)

            hide()
            message.success('取消成功')
            setRefetch(!refetch)
        } catch (e) {
            console.error(e)
            message.error('取消失败')
        }
    }

    const columns = [
        {
            key: 'unitPrice',
            title: 'Price',
            dataIndex: 'unitPrice',
            render: (price) => `${price} ETH`,
        },
        {
            key: 'unitPrice',
            title: 'USD Price',
            dataIndex: 'unitPrice',
            render: (price) => '$' + `${price * 1608}`,
        },
        {
            key: 'duration',
            title: 'Expiration',
            dataIndex: 'duration',
            render: (time) => `${time} days`,
        },
        {
            key: 'seller',
            title: 'From',
            dataIndex: 'seller',
        },
        {
            key: 'action',
            render: (_, record) =>
                record.seller === address ? <Button onClick={() => handleCancelOrder({
                    orderId: record.id,
                    order: record.order
                })}>Cancel</Button> : (
                    <Button type='primary' onClick={handleBuy}>Buy</Button>
                ),
        },
    ];

    return (
        <Layout>
            {
                loading
                    ?
                    <Spin />
                    :
                    <Space direction="vertical" style={{ display: 'flex' }}>
                        <div className={styles.title}>{data.name}</div>
                        <div className={styles.img}>
                            <Image src={data.cover} />
                        </div>
                        <Card title="">
                            <Space>
                                {isCanBuy ?
                                    <Button type="primary" onClick={handleBuy}>
                                        Buy now
                                    </Button> : null}
                                <Button onClick={makingOffer}>Make offer</Button>
                                {isExistInWallet ? <Button onClick={() => setIsModalOpen(true)}>Sell</Button> : null}
                            </Space>
                        </Card>
                        <Table columns={columns} dataSource={data.listings} pagination={false} />
                    </Space>
            }
            <Modal title="Sell" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form}>
                    <Form.Item name="quantity" rules={[{ required: true }]} label="quantity">
                        <InputNumber min={1} max={availableAmounts} />
                    </Form.Item>
                    <Form.Item name="amount" rules={[{ required: true }]} label="ETH">
                        <Input />
                    </Form.Item>
                    <Form.Item name="time" rules={[{ required: true }]} label="Duration">
                        <RangePicker />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};
