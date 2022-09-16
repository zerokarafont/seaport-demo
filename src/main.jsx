import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import { App } from './App'
import { NFT1155List } from './pages/NFT1155List'
import { NFT1155Detail } from './pages/NFT1155Detail'
import { TestPage } from './pages/TestPage'
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
        element: <div>721list</div>
      },
      {
        path: '/721/:contract/:token_id',
        element: <div>721detail</div>
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
        path: '/test',
        element: <TestPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <RouterProvider router={router} />
    </WagmiConfig>
  </React.StrictMode>
)
