// Global variables for provider, signer, and contract
let provider, signer, contract;

// Replace with your deployed contract address on Sepolia
const contractAddress = "0xa9B707daC349dD8c8CfAB99Aa7AF8668e1686F5B";

// Replace with your actual ABI array from the compiled smart contract
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "AdminAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "AdminRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "CertificateRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "admins",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metaURI",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "valid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_metaURI",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"name": "removeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "revokeCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "verifyCertificate",
		"outputs": [
			{
				"internalType": "bool",
				"name": "valid",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metaURI",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Function to connect to MetaMask and initialize the contract
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Connected: " + address;
    // Instantiate the contract using its address, ABI, and the signer for sending transactions
    contract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    alert("MetaMask not detected!");
  }
}

// Function to issue a certificate via the smart contract (state-changing function)
async function issueCertificate() {
  const recipient = document.getElementById("recipientAddress").value;
  const metaURI = document.getElementById("metaURI").value;
  if (!recipient || !metaURI) {
    document.getElementById("status").innerText = "Recipient and MetaURI are required!";
    return;
  }
  try {
    const tx = await contract.issueCertificate(recipient, metaURI, { gasLimit: 300000 });
    await tx.wait();
    document.getElementById("status").innerText = "Certificate Issued Successfully!";
  } catch (error) {
    document.getElementById("status").innerText = "Error: " + error.message;
  }
}

// Function to verify a certificate (view function that doesn't generate a transaction hash)
async function verifyCertificate() {
  const id = document.getElementById("verifyCertId").value;
  if (!id) {
    document.getElementById("status").innerText = "Certificate ID is required!";
    return;
  }
  try {
    const result = await contract.verifyCertificate(id);
    const [valid, issuer, metaURI] = result;
    const output = valid 
      ? `Valid Certificate\nIssuer: ${issuer}\nMetaURI: ${metaURI}` 
      : "Certificate is invalid.";
    document.getElementById("verifyResult").innerText = output;
  } catch (error) {
    document.getElementById("status").innerText = "Error: " + error.message;
  }
}

// Function to add an admin via the smart contract (state-changing function)
async function addAdmin() {
  const newAdmin = document.getElementById("adminAddress").value;
  if (!newAdmin) {
    document.getElementById("adminStatus").innerText = "Please provide a wallet address.";
    return;
  }
  try {
    // Calling the addAdmin function on the contract; only the owner should be able to do this.
    const tx = await contract.addAdmin(newAdmin, { gasLimit: 300000 });
    await tx.wait();
    document.getElementById("adminStatus").innerText = "Admin added successfully! (Tx Hash: " + tx.hash + ")";
  } catch (error) {
    document.getElementById("adminStatus").innerText = "Error: " + error.message;
  }
}
