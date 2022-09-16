import { createBrowserRouter } from 'react-router-dom'
import { App } from '../App'
import { NFT1155List } from '../pages/NFT1155List'
import { NFT1155Detail } from '../pages/NFT1155Detail'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '1155/list',
                element: <NFT1155List />
            }
        ],
    }
    // {
    //     path: '/',
    //     element: <App />,
    //     children: [
    //         {
    //             path: '/1155/list',
    //             element: <NFT1155List />
    //         },
    //         {
    //             path: '/1155/:contract/:token_id',
    //             element: <NFT1155Detail />
    //         }
    //     ]
    // }
])