import { Layout, Menu } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, Link, useHref, useLocation, useMatch } from 'react-router-dom'
import { ConnectWallet } from './components/ConnectWallet'

const { Header, Sider, Content } = Layout

export const App = () => {
    const [collapsed, setCollapsed] = useState(false)

    const href = useHref()

    const items = [
        {
            key: '0',
            label: 'DEMO',
            path: ''
        },
        {
            key: '1',
            label: <Link to="/1155/list">1155 List</Link>,
            path: '/1155/list'
        },
        {
            key: '2',
            label: <Link to="/721/list">721 List</Link>,
            path: '/721/list'
        },
        {
            key: '3',
            label: <Link to="/account">My Account</Link>,
            path: '/account'
        },
    ]

    const selected = useMemo(() => {
        const item = items.find(item => item.path === href)
        return [item?.key || '0']
    }, [href])

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={selected}
                    items={items}
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