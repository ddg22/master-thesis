/**
 * Requests permission to access a student's academic wallet.
 * Universities must request access before they can read or modify student records.
 * @param {Wallet} universityWallet - The university EOA
 * @param {string} studentWalletAddress - The student's SCA address
 * @param {PermissionType} type - Type of permission requested (Read or Write)
 * @returns {Promise<void>} Promise that resolves when the permission request is 
 *                          submitted and confirmed
 */
export async function askForPermission(
	universityWallet: Wallet,
	studentWalletAddress: string,
	type: PermissionType
): Promise<void>
