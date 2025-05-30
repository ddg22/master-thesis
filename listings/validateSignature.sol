/**
 * @notice Validates the signature on a user operation
 * @dev Verifies that the operation was signed by the account owner
 * @param _userOp The user operation containing the signature to validate
 * @param _userOpHash The hash of the user operation that was signed
 * @return validationData 0 if signature is valid, 1 if invalid
 */
function _validateSignature(
	PackedUserOperation calldata _userOp,
	bytes32 _userOpHash
) internal virtual override returns (uint256 validationData) {
	// Verify the signature matches the owner's address
	if (owner != ECDSA.recover(_userOpHash, _userOp.signature))
		return SIG_VALIDATION_FAILED;
	return SIG_VALIDATION_SUCCESS;
}