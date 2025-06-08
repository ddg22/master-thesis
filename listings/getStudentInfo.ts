/**
 * Retrieves basic student information from the blockchain.
 * Only fetches personal data without academic results.
 * @param {Wallet} universityWallet - The university EOA with read permissions
 * @param {string} studentWalletAddress - The student's SCA address
 * @returns {Promise<Student>} The student's basic information
 */
async function getStudentInfo(
	universityWallet: Wallet,
	studentWalletAddress: string
): Promise<Student>
 