/**
 * @notice Performs a view call to another contract
 * @dev Only the owner can execute view calls; uses staticcall to ensure no state 
 * changes
 * @param _targetContract Address of the contract to call
 * @param _calldata The encoded function data to send to the target contract
 * @return bytes The data returned from the view call
 */
function executeViewCall(
	address _targetContract,
	bytes calldata _calldata
) external view returns (bytes memory) {
	// Only owner can execute view calls
	if (msg.sender != owner) {
		revert UnauthorizedCall();
	}
	// Static call ensures we only execute view functions
	(bool success, bytes memory returnData) = _targetContract.staticcall(
		_calldata
	);
	if (!success) {
		revert ViewCallFailed(returnData);
	}
	return returnData;
}