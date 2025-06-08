/**
 * Registers a new student in the academic blockchain system.
 * Creates both a student EOA and smart account.
 * @param {Wallet} universityWallet - The university EOA with registration
 *                                    permissions
 * @param {StudentData} student - The student information to register
 * @returns {Promise<StudentCredentials>} The created student credentials and wallet
 *                                        information
 */
async function registerStudent(
	universityWallet: Wallet, 
	student: StudentData
): Promise<StudentCredentials>
