/**
 * @notice Allows a university to request permission to access student data
 * @dev University addresses will be added to READER_APPLICANT
 * or WRITER_APPLICANT roles
 * @param _permissionType Permission type requested (READER_APPLICANT
 * or WRITER_APPLICANT)
 */
function askForPermission(bytes32 _permissionType) external {
	// Validate permission type
	if (
		_permissionType != READER_APPLICANT &&
		_permissionType != WRITER_APPLICANT
	)
	...
}

/**
 * @notice Grants permission to a university
 * @dev Only callable by the student (DEFAULT_ADMIN_ROLE)
 * @param _permissionType Permission type (READER_ROLE or WRITER_ROLE)
 * @param _university Address of university to grant permission to
 */
function grantPermission(
	bytes32 _permissionType,
	address _university
) external onlyRole(DEFAULT_ADMIN_ROLE) {
	// Check if the permission exists
	if (_permissionType != WRITER_ROLE && _permissionType != READER_ROLE)
	...
}