"use client";

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { formatEther } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'

// Add type definitions
type Attestation = {
  issuer: string;
  score: bigint;
  metadata: string;
  timestamp: bigint;
  randomNumber: bigint;
  usdValue: bigint;
};

// Contract ABI and address
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "score",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "metadata",
        "type": "string"
      }
    ],
    "name": "requestAttestation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getAttestation",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "issuer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "score",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "metadata",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "randomNumber",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "usdValue",
            "type": "uint256"
          }
        ],
        "internalType": "struct ReputationToken.Attestation",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserAttestations",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTotalValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { address, isConnected } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [score, setScore] = useState('')
  const [metadata, setMetadata] = useState('')

  // Read user's attestations
  const { data: userAttestations } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserAttestations',
    args: [address],
  }) as { data: bigint[] | undefined };

  // Read user's total value
  const { data: userTotalValue } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserTotalValue',
    args: [address],
  }) as { data: bigint | undefined };

  // Write contract for issuing attestations
  const { writeContract: issueAttestation, isPending: isIssuing } = useWriteContract()

  const handleIssueAttestation = () => {
    if (!recipient || !score || !metadata) return
    
    issueAttestation({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'requestAttestation',
      args: [recipient, BigInt(score), metadata],
    })
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Reputation Token
          </h1>
          <ConnectButton />
        </motion.div>

        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Issue Attestation Form */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Issue Attestation</h2>
                <div className="space-y-4">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      placeholder="0x..."
                    />
                  </motion.div>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metadata</label>
                    <textarea
                      value={metadata}
                      onChange={(e) => setMetadata(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      rows={3}
                    />
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleIssueAttestation}
                    disabled={isIssuing}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isIssuing ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                    ) : 'Issue Attestation'}
                  </motion.button>
                </div>
              </motion.div>

              {/* User's Attestations */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Attestations</h2>
                {userTotalValue && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
                  >
                    <p className="text-lg font-medium text-gray-800">
                      Total Reputation Value: <span className="text-indigo-600">{formatEther(userTotalValue)} ETH</span>
                    </p>
                  </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {userAttestations?.map((tokenId: bigint) => (
                      <motion.div
                        key={tokenId.toString()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AttestationCard tokenId={tokenId} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-xl text-gray-600">Please connect your wallet to continue</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function AttestationCard({ tokenId }: { tokenId: bigint }) {
  const { data: attestation } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAttestation',
    args: [tokenId],
  }) as { data: Attestation | undefined };

  if (!attestation) return null

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800">Score: {attestation.score.toString()}</p>
          <p className="text-sm text-gray-500">Issuer: {attestation.issuer}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(Number(attestation.timestamp) * 1000).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-indigo-600">
            Value: {formatEther(attestation.usdValue)} ETH
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{attestation.metadata}</p>
    </motion.div>
  )
}
