/**
 * Configuration for blockchain network connections.
 * Defines parameters needed to connect to Ethereum networks.
 */
interface BlockchainNetworkConfig {
    /** Chain identifier for the Ethereum network. */
    readonly chainId: string,
    /** JSON-RPC endpoint URL for the Ethereum network. */
    readonly url: string;
    /** Smart contract address for the StudentsRegister contract. */
    readonly registerAddress: string;
    /** Smart contract address for the EntryPoint contract used in the account
	    abstraction protocol. */
    readonly entryPointAddress: string;
    /** Smart contract address for the Paymaster contract that sponsors
	    transaction gas fees. */
    readonly paymasterAddress: string,
}

/**
 * Blockchain network configuration.
 */
export const blockchainConfig: BlockchainNetworkConfig = {
    /** Chain identifier. */
    chainId: "31337",
    /** Network endpoint. */
    url: "http://127.0.0.1:8545",
    /** StudentsRegister contract address. */
    registerAddress: "0x51a240271AB8AB9f9a21C82d9a85396b704E164d",
    /** EntryPoint contract address. */
    entryPointAddress: "0xF2E246BB76DF876Cef8b38ae84130F4F55De395b",
    /** Paymaster contract address. */
    paymasterAddress: "0xB9816fC57977D5A786E654c7CF76767be63b966e",
}