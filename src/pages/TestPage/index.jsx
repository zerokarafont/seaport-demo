import { Button } from 'antd'
import { Seaport } from '@opensea/seaport-js'
import { ethers } from 'ethers'

const provider = new ethers.providers.Web3Provider(window.ethereum)

const seaport = new Seaport(provider)

export const TestPage = () => {

    const offerer = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const fulfiller = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

    const listing = async() => {
        const { executeAllActions } = await seaport.createOrder(
            {
              offer: [
                {
                  itemType: ItemType.ERC721,
                  token: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
                  identifier: "1",
                },
              ],
              consideration: [
                {
                  amount: ethers.utils.parseEther("10").toString(),
                  recipient: offerer,
                },
              ],
            },
            offerer
          );

          const order = await executeAllActions();

            const { executeAllActions: executeAllFulfillActions } =
            await seaport.fulfillOrder({
                order,
                accountAddress: fulfiller,
            });

            const transaction = executeAllFulfillActions();
    }

    const makingAnOffer = async () => {
        const { executeAllActions } = await seaport.createOrder(
            {
              offer: [
                {
                  amount: parseEther("10").toString(),
                  // WETH
                  token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                },
              ],
              consideration: [
                {
                  itemType: ItemType.ERC721,
                  token: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
                  identifier: "1",
                  recipient: offerer,
                },
              ],
            },
            offerer
          );

          const order = await executeAllActions();

            const { executeAllActions: executeAllFulfillActions } =
            await seaport.fulfillOrder({
                order,
                accountAddress: fulfiller.address,
            });

            const transaction = executeAllFulfillActions();
    }

    return (
        <div>
            <Button type='primary' onClick={listing}>Listing</Button>
            <Button type='primary' onClick={makingAnOffer}>Making An Offer</Button>
        </div>
    )
}