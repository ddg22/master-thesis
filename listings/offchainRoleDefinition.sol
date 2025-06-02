/**
 * Role identifiers used for access control.
 * Uses Ethereum's id() function to generate role identifiers from string constants.
 */
export const roleCodes: RoleCodes = {
    /** Role identifier for read access requesters */
    readRequest: id("READER_APPLICANT"),
    /** Role identifier for write access requesters */
    writeRequest: id("WRITER_APPLICANT"),
    /** Role identifier for approved readers */
    read: id("READER_ROLE"),
    /** Role identifier for approved writers */
    write: id("WRITER_ROLE"),
}