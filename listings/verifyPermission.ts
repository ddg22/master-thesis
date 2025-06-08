/**
 * Verifies a university's permission level for a student's academic wallet.
 * @param {Wallet} universityWallet - The university EOA to check permissions for
 * @param {string} studentWalletAddress - The student's SCA address
 * @returns {Promise<PermissionType | null>} The permission level (Read or Write) 
 *                                           or null if no permission
 */
 async function verifyPermission(
	universityWallet: Wallet,
	studentWalletAddress: string
): Promise<PermissionType | null>
