/**
 * Retrieves student information including academic results.
 * Provides a complete academic profile with course outcomes.
 * @param {Wallet} universityWallet - The university EOA with read permissions
 * @param {string} studentWalletAddress - The student's SCA address
 * @returns {Promise<Student>} The student's complete information with academic
 *                             results
 */
async function getStudentWithResult(
	universityWallet: Wallet,
	studentWalletAddress: string
): Promise<Student>
