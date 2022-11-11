import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import { App } from './App'
import { NFT721List } from './pages/NFT721List'
import { NFT721Detail } from './pages/NFT721Detail'
import { NFT1155List } from './pages/NFT1155List'
import { NFT1155Detail } from './pages/NFT1155Detail'
import { MyWalletNFTs } from './pages/Mine'
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import * as BufferModule from 'buffer'
import 'reset-css'
import 'antd/dist/antd.css'

window.Buffer = BufferModule.Buffer

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider()
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/721/list',
        element: <NFT721List />
      },
      {
        path: '/721/:contract/:token_id',
        element: <NFT721Detail />
      },
      {
        path: '/1155/list',
        element: <NFT1155List />
      },
      {
        path: '/1155/:contract/:token_id',
        element: <NFT1155Detail />
      },
      {
        path: '/account',
        element: <MyWalletNFTs />
      }
    ],
    // errorElement: <div>not found</div>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <RouterProvider router={router} />
    </WagmiConfig>
  </React.StrictMode>
)
