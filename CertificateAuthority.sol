// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title Certificate Issuance & Verification Authority
/// @notice Allows approved admins to issue certificates, and anyone to verify them
contract CertificateAuthority {
    address public owner;
    uint256 private nextId;
    mapping(address => bool) public admins;

    struct Certificate {
        uint256 id;
        address issuer;
        address recipient;
        string metaURI;
        bool valid;
    }

    mapping(uint256 => Certificate) public certificates;

    /// @notice Emitted when a new admin is added
    event AdminAdded(address indexed admin);
    /// @notice Emitted when an admin is removed
    event AdminRemoved(address indexed admin);
    /// @notice Emitted when a certificate is issued
    event CertificateIssued(uint256 indexed id, address indexed recipient);


    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        nextId = 1;
    }

    /// @dev Restricts function to contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Owner only");
        _;
    }

    /// @dev Restricts function to approved admins
    modifier onlyAdmin() {
        require(admins[msg.sender], "Admin only");
        _;
    }

    /// @notice Grant admin role to an address
    /// @param _admin The address to grant admin rights
    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    /// @notice Revoke admin role from an address
    /// @param _admin The address to revoke admin rights
    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    /// @notice Issue a new certificate to a recipient
    /// @param _recipient The address receiving the certificate
    /// @param _metaURI A URI pointing to off-chain metadata (e.g., IPFS)
    /// @return certId The newly issued certificate ID
    function issueCertificate(address _recipient, string calldata _metaURI)
        external
        onlyAdmin
        returns (uint256 certId)
    {
        certId = nextId++;
        certificates[certId] = Certificate({
            id: certId,
            issuer: msg.sender,
            recipient: _recipient,
            metaURI: _metaURI,
            valid: true
        });
        emit CertificateIssued(certId, _recipient);
    }

    

    /// @notice Verify the status and details of a certificate
    /// @param _id The certificate ID to check
    /// @return valid Whether the certificate is currently valid
    /// @return issuer The address that issued the certificate
    /// @return metaURI The metadata URI associated with the certificate
    function verifyCertificate(uint256 _id)
        external
        view
        returns (bool valid, address issuer, string memory metaURI)
    {
        if (!_exists(_id)) {
            return (false, address(0), "");
        }
        Certificate storage cert = certificates[_id];
        return (cert.valid, cert.issuer, cert.metaURI);
    }

    /// @dev Internal helper to check existence
    function _exists(uint256 _id) internal view returns (bool) {
        return certificates[_id].id == _id;
    }
}
