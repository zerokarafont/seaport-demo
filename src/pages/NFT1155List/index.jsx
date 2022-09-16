import { Layout } from 'antd'
import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { get1155List } from '../../api/1155'
import { NFTCard } from '../../components/NFTCard'
import styles from './index.module.css'

export const NFT1155List = () => {
    const [data, setData] = useState([])
    const { address } = useAccount()

    const fetchData = async () => {
        const data = await get1155List()
        console.log('getData', data)
        setData(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Layout>
            <div className={styles.container}>
                {
                    data.map(item => <NFTCard key={item.tokenId} data={item} path={`/1155/${item.contract}/${item.tokenId}`}  />)
                }
            </div>
        </Layout>
    )
} 