import { useMemo } from 'react'
import { Button, Space, Dropdown } from 'antd'
import { WalletTwoTone, DownOutlined } from '@ant-design/icons'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export const ConnectWallet = () => {
    const { address = '', isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector()
    })
    const { disconnect } = useDisconnect()

    const short = useMemo(() => {
        const prefix = address.slice(0,6)
        const suffix = address.slice(-4)
        return `${prefix}...${suffix}`
    } ,[address])

    return (
        <Space>
            {
                isConnected
                    ?
                    <Dropdown overlay={<Button type="warn" onClick={disconnect}>disconnect</Button>}>
                        <div style={{ cursor: 'pointer' }}>
                            <span style={{ color: 'white' }}>{ short }</span>
                            <DownOutlined style={{ color: 'white' }} />
                        </div>
                    </Dropdown>
                    :
                    <Button type="primary" onClick={connect}>
                        <WalletTwoTone />
                        Connect Wallet
                    </Button>
            }
        </Space>
    )
}