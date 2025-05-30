// Encode the function call
const calldata = targetContract.interface.encodeFunctionData(functionName, params);
// Execute the view call through the smart account
const results = await smartAccount.connect(connectedUniversity)
.executeViewCall(targetContractAddress, calldata);
// Decode the result
const decodedResults = targetContract.interface
.decodeFunctionResult(functionName, results);