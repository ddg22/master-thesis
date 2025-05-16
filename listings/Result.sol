/**
 * @dev Represents an academic result
 * @param code Course code
 * @param name Course name
 * @param university Smart wallet address of the university that created the record
 * @param degreeCourse Name of the degree program
 * @param ects ECTS credits for the course
 * @param grade Final grade
 * @param date Date when the grade was assigned
 * @param certificateHash CID of the IPFS file representing the certificate
 */
struct Result {
    string code;
    string name;
    address university;
    string degreeCourse;
    uint16 ects;
    string grade;
    uint date;
    string certificateHash;
}