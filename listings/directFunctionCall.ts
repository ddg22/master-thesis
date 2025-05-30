import { StudentsRegister__factory } from 
"@typechain/factories/contracts/StudentsRegister__factory"

// Ethereum JSON-RPC provider instance 
const provider = new JsonRpcProvider(blockchainConfig.url);
// Retrieves the StudentsRegister contract instance
const studentRegister = StudentsRegister__factory
.connect(blockchainConfig.registerAddress, provider);
// Retrieves the student's smart account address from the StudentsRegister contract
const studentAccountAddress = await studentsRegister
.connect(connectedStudent).getStudentAccount();