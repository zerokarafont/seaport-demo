import { Layout , Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { get721List } from '../../api/721'
import { NFTCard } from '../../components/NFTCard'
import styles from './index.module.css'

export const NFT721List = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const { address } = useAccount()

    const fetchData = async () => {
        setLoading(true)
        const data = await get721List({ address })
        setData(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [address])

    return (
        <Layout>
            <div className={styles.container}>
                { loading ? <Spin /> : null }
                {
                    data.map(item => <NFTCard key={item.tokenId} data={item} path={`/721/${item.contract}/${item.tokenId}`}  />)
                }
            </div>
        </Layout>
    )
} 