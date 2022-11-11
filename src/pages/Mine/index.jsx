import { Layout , Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { fetchMineWalletNFTs } from '../../api/mine'
import { NFTCard } from '../../components/NFTCard'
import styles from './index.module.css'

export const MyWalletNFTs = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const { address } = useAccount()

    const fetchData = async () => {
        setLoading(true)
        const data = await fetchMineWalletNFTs(address)
        setData(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [address])

    const decidePath = (item) => {
        if (item.type === 'ERC721') {
            return `/721/${item.contract}/${item.tokenId}`
        }
        if (item.type === 'ERC1155') {
            return `/1155/${item.contract}/${item.tokenId}`
        }
        return '/404'
    }

    return (
        <Layout>
            <div className={styles.container}>
                { loading ? <Spin /> : null }
                {
                    data.map(item => <NFTCard key={item.tokenId} data={item} path={decidePath(item)}  />)
                }
            </div>
        </Layout>
    )
} 