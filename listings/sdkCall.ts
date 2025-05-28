// Import the SDK
import * as eduwallet from 'eduwallet-sdk';

// Register the student using the SDK
const student = await eduwallet.registerStudent(
	uni,
	{
		name,
		surname,
		birthDate,
		birthPlace,
		country,
	});