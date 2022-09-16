
export const VideoPreview = ({ src , width, height }) => {
    return (
        <video controls autoplay name="media" width={width} height={height}>
            <source src={src} type="video/mp4"></source>
        </video>
    )
}