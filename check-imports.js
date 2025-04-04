const fs = require('fs');
const path = require('path');

// Check if OpenZeppelin contracts are installed
const openZeppelinPath = path.join(__dirname, 'node_modules', '@openzeppelin', 'contracts');
console.log(`Looking for OpenZeppelin at: ${openZeppelinPath}`);

if (fs.existsSync(openZeppelinPath)) {
  console.log('OpenZeppelin directory exists!');
  
  // List the contents of the directory
  const contents = fs.readdirSync(openZeppelinPath);
  console.log('Contents of OpenZeppelin directory:');
  contents.forEach(item => {
    console.log(`- ${item}`);
  });
  
  // Check specific files
  const erc721Path = path.join(openZeppelinPath, 'token', 'ERC721');
  const ownablePath = path.join(openZeppelinPath, 'access', 'Ownable.sol');
  
  console.log('\nChecking specific files:');
  console.log(`ERC721 directory exists: ${fs.existsSync(erc721Path)}`);
  console.log(`Ownable.sol exists: ${fs.existsSync(ownablePath)}`);
  
  // Check if token directory exists
  const tokenPath = path.join(openZeppelinPath, 'token');
  if (fs.existsSync(tokenPath)) {
    console.log('\nContents of token directory:');
    const tokenContents = fs.readdirSync(tokenPath);
    tokenContents.forEach(item => {
      console.log(`- ${item}`);
    });
  }
  
  // Check if access directory exists
  const accessPath = path.join(openZeppelinPath, 'access');
  if (fs.existsSync(accessPath)) {
    console.log('\nContents of access directory:');
    const accessContents = fs.readdirSync(accessPath);
    accessContents.forEach(item => {
      console.log(`- ${item}`);
    });
  }
  
  // Check if utils directory exists
  const utilsPath = path.join(openZeppelinPath, 'utils');
  if (fs.existsSync(utilsPath)) {
    console.log('\nContents of utils directory:');
    const utilsContents = fs.readdirSync(utilsPath);
    utilsContents.forEach(item => {
      console.log(`- ${item}`);
    });
  }
  
  // Create a simple test contract
  const testContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Counters.sol";

contract TestContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor() ERC721("Test", "TEST") Ownable(msg.sender) {}
    
    function mint() public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        return newTokenId;
    }
}`;
  
  // Ensure the lib/contracts directory exists
  const contractsDir = path.join(__dirname, 'lib', 'contracts');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(contractsDir, 'TestContract.sol'), testContract);
  console.log('\nTest contract created at lib/contracts/TestContract.sol');
} else {
  console.log('OpenZeppelin directory does not exist. Please reinstall @openzeppelin/contracts.');
  
  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  console.log(`node_modules exists: ${fs.existsSync(nodeModulesPath)}`);
  
  if (fs.existsSync(nodeModulesPath)) {
    const contents = fs.readdirSync(nodeModulesPath);
    console.log('Contents of node_modules directory:');
    contents.forEach(item => {
      console.log(`- ${item}`);
    });
  }
} 