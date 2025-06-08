/**
 * Enrols a student in one or more academic courses.
 * Records course enrolments on the student's academic blockchain record, 
 * establishing the foundation for future evaluations.
 * @param {Wallet} universityWallet - The university EOA with enrolment authority
 * @param {string} studentWalletAddress - The student's SCA
 * @param {CourseInfo[]} courses - Array of courses to enrol the student in (code,
 *                                 name, degreeCourse, ects)
 * @returns {Promise<void>} Promise that resolves when all enrolments are 
 *                          successfully recorded
 */
async function enrolStudent(
	universityWallet: Wallet,
	studentWalletAddress: string,
	courses: CourseInfo[]
): Promise<void>
