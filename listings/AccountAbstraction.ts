import { ethers, TypedDataDomain, TypedDataField } from 'ethers';
import { SmartAccount__factory } from '@typechain/...';
import { blockchainConfig, logError } from 'src/conf';
import { EntryPoint } from '@typechain/...';
import { AddressLike, BigNumberish, BytesLike } from 'ethers';
import { getEntryPoint } from 'src/utils';

/**
 * Constants for EIP-712 domain.
 */
const DOMAIN_NAME = 'ERC4337';
const DOMAIN_VERSION = '1';

/**
 * Returns the EIP-712 domain for ERC-4337 user operations.
 * @param entryPoint EntryPoint contract address
 * @param chainId Chain ID
 */
export function getErc4337TypedDataDomain(entryPoint: string, chainId: number):
TypedDataDomain {
    return {
        name: DOMAIN_NAME,
        version: DOMAIN_VERSION,
        chainId: chainId,
        verifyingContract: entryPoint
    };
}

/**
 * Returns the EIP-712 types for ERC-4337 user operations.
 */
export function getErc4337TypedDataTypes(): { [type: string]: TypedDataField[] } {
    return {
        PackedUserOperation: [
            { name: 'sender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'initCode', type: 'bytes' },
            { name: 'callData', type: 'bytes' },
            { name: 'accountGasLimits', type: 'bytes32' },
            { name: 'preVerificationGas', type: 'uint256' },
            { name: 'gasFees', type: 'bytes32' },
            { name: 'paymasterAndData', type: 'bytes' }
        ]
    };
}

/**
 * Packs paymaster data for the user operation.
 * @param paymaster Paymaster contract address
 * @param paymasterVerificationGasLimit Gas limit for paymaster verification
 * @param postOpGasLimit Gas limit for post-operation
 * @param paymasterData Additional paymaster data
 * @returns Packed paymasterAndData bytes
 */
function packPaymasterData(
    paymaster: string,
    paymasterVerificationGasLimit: number | bigint,
    postOpGasLimit: number | bigint,
    paymasterData: string
): string {
    return ethers.concat([
        paymaster,
        ethers.zeroPadValue(ethers.toBeHex(paymasterVerificationGasLimit), 16),
        ethers.zeroPadValue(ethers.toBeHex(postOpGasLimit), 16),
        paymasterData
    ]);
}

/**
 * UserOperation interface for ERC-4337.
 */
interface UserOperation {
    sender: string;
    nonce: bigint;
    initCode: string;
    callData: string;
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    paymaster: string;
    paymasterVerificationGasLimit: bigint;
    paymasterPostOpGasLimit: bigint;
    paymasterData: string;
    signature: string;
}

/**
 * PackedUserOperation interface for EntryPoint contract.
 */
interface PackedUserOperation {
    sender: AddressLike;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    accountGasLimits: BytesLike;
    preVerificationGas: BigNumberish;
    gasFees: BytesLike;
    paymasterAndData: BytesLike;
    signature: BytesLike;
}

/**
 * AccountAbstraction manager for ERC-4337 user operations.
 * Handles creation, signing, packing, and execution of user operations
 * for smart accounts using the EntryPoint contract.
 */
export class AccountAbstraction {
    private provider: ethers.Provider;
    private entryPoint: EntryPoint;
    private signer: ethers.Wallet;

    /**
     * Constructs the AccountAbstraction manager.
     * @param provider Ethers provider instance
     * @param signer Wallet used for signing user operations
     */
    constructor(
        provider: ethers.Provider,
        signer: ethers.Wallet,
    ) {
        this.provider = provider;
        this.signer = signer;
        this.entryPoint = getEntryPoint();
    }

    /**
     * Creates a user operation for a smart account call.
     * @param params User operation parameters (sender, target, value, data,
	 *               initCode)
     * @returns UserOperation object
     */
    async createUserOp({
        sender,
        target,
        value,
        data,
        initCode = '0x',
    }: {
        sender: string;
        target: string;
        value: bigint;
        data: string;
        initCode?: string;
    }): Promise<UserOperation> {
        const accountContract = SmartAccount__factory.connect(sender,
		this.provider);
        const callData = accountContract.interface.encodeFunctionData('execute',
		[target, value, data]);

        // Get the nonce for the smart account
        const nonce = await this.entryPoint.getNonce(sender, 0);

        // Get fee data for gas pricing
        const feeData = await this.provider.getFeeData();

        // Paymaster address from config
        const paymaster = blockchainConfig.paymasterAddress;

        const userOp: UserOperation = {
            sender,
            nonce,
            initCode,
            callData,
            callGasLimit: BigInt(1_000_000),
            verificationGasLimit: BigInt(5_000_000),
            preVerificationGas: BigInt(500_000),
            maxFeePerGas: feeData.maxFeePerGas || BigInt(2_000_000_000),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ||
								  BigInt(1_000_000_000),
            paymaster: paymaster,
            paymasterVerificationGasLimit: BigInt(2_000_000),
            paymasterPostOpGasLimit: BigInt(2_000_000),
            paymasterData: '0x',
            signature: '0x',
        };

        return userOp;
    }

    /**
     * Computes the hash of a user operation for signing.
     * @param userOp UserOperation object
     * @returns Hash string (bytes32)
     */
    async getUserOpHash(userOp: UserOperation): Promise<string> {
        // Convert to packed format for hashing
        const packedUserOp = this.packUserOp(userOp);
        // Call the EntryPoint contract's getUserOpHash (returns bytes32)
        return await this.entryPoint.getUserOpHash(packedUserOp);
    }

    /**
     * Signs a user operation using EIP-712 typed data.
     * @param userOp UserOperation object
     * @returns UserOperation with signature
     */
    async signUserOp(userOp: UserOperation): Promise<UserOperation> {
        const chainId = parseInt(blockchainConfig.chainId);
        const entryPointAddress = blockchainConfig.entryPointAddress;

        const packedUserOp = this.packUserOp(userOp);

        const signature = await this.signer.signTypedData(
            getErc4337TypedDataDomain(entryPointAddress, chainId),
            getErc4337TypedDataTypes(),
            packedUserOp
        );

        return {
            ...userOp,
            signature
        };
    }

    /**
     * Converts a UserOperation to the packed format required by EntryPoint.
     * @param userOp UserOperation object
     * @returns PackedUserOperation object
     */
    packUserOp(userOp: UserOperation): PackedUserOperation {
        // Pack callGasLimit and verificationGasLimit into a single bytes32
        const accountGasLimits = ethers.solidityPacked(
            ['uint128', 'uint128'],
            [userOp.callGasLimit, userOp.verificationGasLimit]
        );

        // Pack maxFeePerGas and maxPriorityFeePerGas into a single bytes32
        const gasFees = ethers.solidityPacked(
            ['uint128', 'uint128'],
            [userOp.maxPriorityFeePerGas, userOp.maxFeePerGas]
        );

        const paymasterAndData = packPaymasterData(
            userOp.paymaster,
            userOp.paymasterVerificationGasLimit,
            userOp.paymasterPostOpGasLimit,
            userOp.paymasterData
        );

        return {
            sender: userOp.sender,
            nonce: userOp.nonce,
            initCode: userOp.initCode,
            callData: userOp.callData,
            accountGasLimits: accountGasLimits,
            preVerificationGas: userOp.preVerificationGas,
            gasFees: gasFees,
            paymasterAndData: paymasterAndData,
            signature: userOp.signature
        };
    }

    /**
     * Executes a batch of user operations via EntryPoint.handleOps.
     * @param userOps Array of UserOperation objects
     * @param beneficiary Address to receive transaction fees
     * @returns TransactionResponse object
     * @throws Error if transaction fails
     */
    async executeUserOps(userOps: UserOperation[], beneficiary: string):
	Promise<ethers.TransactionResponse> {
        try {
            // Sign and pack each user operation in the batch
            const packedUserOps = await Promise.all(
                userOps.map(async (op) => {
                    const signedOp = await this.signUserOp(op);
                    return this.packUserOp(signedOp);
                })
            );

            // Direct call to EntryPoint.handleOps with all operations
            const connectedEntryPoint = this.entryPoint.connect(this.signer);
            return await connectedEntryPoint.handleOps(packedUserOps,
			beneficiary
			);
        } catch (error) {
            logError('Error sending batch user operations:', error);
            throw error;
        }
    }

    /**
     * Verifies the result of a user operation transaction.
     * Throws an error if the operation failed, including revert reasons.
     * @param receipt Transaction receipt
     * @param targetContract Target contract for error decoding
     * @throws Error if operation failed or logs are missing
     */
    verifyTransaction(receipt: ethers.TransactionReceipt,
					  targetContract: ethers.BaseContract): void {
        const entryPoint = this.entryPoint;

        if (!receipt || !receipt.logs) {
            throw new Error("No receipt or logs found in transaction receipt.");
        }

        // Find UserOperationEvent logs
        const userOpEvents = receipt.logs.filter(log => {
            try {
                const parsedLog = entryPoint.interface.parseLog(log);
                return parsedLog?.name === "UserOperationEvent";
            } catch {
                return false;
            }
        });

        if (userOpEvents.length === 0) {
            throw new Error("No UserOperationEvent found in transaction logs.");
        }

        let parsedUserOpEvent;
        try {
            parsedUserOpEvent = entryPoint.interface.parseLog(userOpEvents[0]);
        } catch (e) {
            throw new Error("Failed to parse UserOperationEvent log: " +
			e instanceof Error ? e.message : String(e)));
        }

        if (!parsedUserOpEvent?.args) {
            throw new Error("UserOperationEvent log missing args.");
        }

        const success = parsedUserOpEvent.args.success;

        if (!success) {
            // Find UserOperationRevertReason logs
            const revertEvents = receipt.logs.filter(log => {
                try {
                    const parsedLog = entryPoint.interface.parseLog(log);
                    return parsedLog?.name === "UserOperationRevertReason";
                } catch {
                    return false;
                }
            });

            if (revertEvents.length === 0) {
                throw new Error("UserOperation failed but no" +
				"UserOperationRevertReason found in logs."
				);
            }

            let parsedRevertEvent;
            try {
                parsedRevertEvent = entryPoint.interface.parseLog(
				revertEvents[0]
				);
            } catch (e) {
                throw new Error("Failed to parse UserOperationRevertReason log: "
				+ (e instanceof Error ? e.message : String(e)));
            }

            if (!parsedRevertEvent?.args) {
                throw new Error("UserOperationRevertReason log missing args.");
            }

            const revertData = parsedRevertEvent.args.revertReason;

            // Try to decode custom error
            const decodedError = targetContract.interface.parseError(revertData);
            if (decodedError) {
                throw new Error(
                    `UserOperation reverted with custom error:` +
					`${decodedError.name}, args:` +
					`${JSON.stringify(decodedError.args)}`
                );
            } else {
                throw new Error("UserOperation reverted with unknown" +
				"custom error.");
            }
        }
    }
}
