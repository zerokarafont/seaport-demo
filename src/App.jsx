import { Layout, Menu } from 'antd'
import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ConnectWallet } from './components/ConnectWallet'

const { Header, Sider, Content } = Layout

export const App = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['0']}
                    items={[
                        {
                           key: '0',
                           label: 'DEMO'
                        },
                        {
                            key: '1',
                            label: <Link to="/1155/list">1155 List</Link>,
                        },
                        {
                            key: '2',
                            label: <Link to="/721/list">721 List</Link>,
                        },
                        {
                            key: '3',
                            label: <Link to="/account">My Account</Link>,
                        },
                        {
                            key: '4',
                            label: <Link to="/test">Test</Link>
                        }
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                   <ConnectWallet />
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
} 