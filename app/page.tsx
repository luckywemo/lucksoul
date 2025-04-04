"use client";

import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { CONTRACT_ADDRESSES, REPUTATION_TOKEN_ABI } from '@/lib/web3-config'
import { ConnectButton } from '@coinbase/onchainkit'
import { AttestationNotifications } from './components/AttestationNotifications'
import { saveAttestationNotification } from '@/lib/attestation-notification'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [score, setScore] = useState('')
  const [metadata, setMetadata] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: userAttestations } = useContractRead({
    address: CONTRACT_ADDRESSES.REPUTATION_TOKEN,
    abi: REPUTATION_TOKEN_ABI,
    functionName: 'getUserAttestations',
    args: [address],
    enabled: !!address,
  })

  const { write: issueAttestation } = useContractWrite({
    address: CONTRACT_ADDRESSES.REPUTATION_TOKEN,
    abi: REPUTATION_TOKEN_ABI,
    functionName: 'issueAttestation',
  })

  const handleIssueAttestation = async () => {
    if (!recipientAddress || !score || !metadata || !address) return
    
    setIsSubmitting(true)
    try {
      const result = await issueAttestation({
        args: [recipientAddress, BigInt(score), metadata],
      })
      
      // Save notification
      await saveAttestationNotification({
        issuer: address,
        recipient: recipientAddress,
        score: parseInt(score),
        metadata,
        timestamp: Date.now(),
      })
      
      // Clear form
      setRecipientAddress('')
      setScore('')
      setMetadata('')
    } catch (error) {
      console.error('Error issuing attestation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Luckysoul</h1>
          <ConnectButton />
        </div>

        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Issue Attestation</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score (0-100)
                    </label>
                    <input
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metadata
                    </label>
                    <textarea
                      value={metadata}
                      onChange={(e) => setMetadata(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Describe the attestation..."
                    />
                  </div>
                  <button
                    onClick={handleIssueAttestation}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Issuing...' : 'Issue Attestation'}
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Your Attestations</h2>
                {userAttestations && userAttestations.length > 0 ? (
                  <div className="space-y-4">
                    {userAttestations.map((tokenId) => (
                      <div key={tokenId.toString()} className="border p-4 rounded">
                        <p>Token ID: {tokenId.toString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No attestations yet</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <AttestationNotifications />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
