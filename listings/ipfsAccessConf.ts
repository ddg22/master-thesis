/**
 * Configuration for IPFS storage.
 * Defines parameters needed to retrieve certificates.
 */
interface IpfsStorageConfig {
    /** Gateway URL for retrieving IPFS content */
    gatewayUrl: string;
}

/**
 * IPFS storage configuration.
 */
export const ipfsConfig: IpfsStorageConfig = {
    /** IPFS gateway url. */
    gatewayUrl: "https://ipfs.io/ipfs/",
}