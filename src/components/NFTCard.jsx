import { Card , Image } from 'antd'
import { isImage } from '../utils/helper'
import { VideoPreview } from './VideoPreview'
import { useNavigate } from 'react-router-dom'

const { Meta } = Card

export const NFTCard = ({ data , path }) => {
    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(path)
    }

    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={
                data && !isImage(data.cover) 
                ?
                    // <VideoPreview width={240} height={240} src={data.cover} />
                    <Image width={240} src={data.cover} />
                :
                    <Image width={240} src={data.cover} />
            }
            onClick={handleNavigate}
        >
            <Meta title={data.name} description="" />
        </Card>
    )
}