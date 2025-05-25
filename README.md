# Certificate Issuance & Verification DApp

**Description**  
A decentralized application that lets authorized admins issue on-chain certificates and allows anyone to verify them by ID. Built in Solidity and deployed to the Sepolia Testnet, with a simple HTML/JS frontend using Ethers.js and MetaMask.

## 🛠 Tech Stack
- **Smart Contract**: Solidity (v0.8.17) in Remix IDE  
- **Blockchain**: Sepolia Testnet  
- **Frontend**: HTML, CSS, JavaScript, Ethers.js, MetaMask

## 🚀 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/certificate-dapp.git
   cd certificate-dapp
   ```

2. **Install a local server** (or use Python)  
   ```bash
   npm install -g http-server
   # or
   python -m http.server 8000
   ```

3. **Serve the frontend**  
   ```bash
   cd frontend
   http-server .    # then open http://localhost:8080
   # or python -m http.server 8000
   ```

4. **Connect MetaMask**  
   - Switch to **Sepolia Testnet**  
   - Click **Connect Wallet** in the DApp

## 📝 Usage

1. **Issue Certificate**  
   - Enter **Recipient Address**  
   - Enter **Meta URI** (e.g. `https://example.com/cert.json`)  
   - Click **Issue** → confirm in MetaMask  

2. **Verify Certificate**  
   - Enter **Certificate ID**  
   - Click **Verify** → see status, issuer, and URI  

## 📌 Deployment

- **Contract Address**: `0xYourDeployedContractAddress`  
- **ABI** is embedded in `frontend/assignment.js`

## 🔗 Transaction Hashes

1. **Issue Certificate**: `0xAAA...`  
2. **Add Admin**: `0xBBB...`  
3. **Revoke Certificate**: `0xCCC...`  

## 📁 Repository Structure

```plaintext
certificate-dapp/
├── contracts/
│   └── CertificateAuthority.sol
├── frontend/
│   ├── index.html
│   └── assignment.js
└── README.md
```
