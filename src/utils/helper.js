import config from './config'

export function convertIPFStoHTTP(link) {
    if (link.includes("ipfs://")) {
        return link.replace("ipfs://", config.IPFS_GATEWAY)
    }
    return link
}

export function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}