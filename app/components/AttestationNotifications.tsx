'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { AttestationNotification, getUserAttestationNotifications } from '@/lib/attestation-notification'

export function AttestationNotifications() {
  const { address } = useAccount()
  const [notifications, setNotifications] = useState<AttestationNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!address) return
      
      try {
        const userNotifications = await getUserAttestationNotifications(address)
        setNotifications(userNotifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [address])

  if (!address) return null
  if (isLoading) return <div className="text-gray-500">Loading notifications...</div>
  if (notifications.length === 0) return <div className="text-gray-500">No notifications yet</div>

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Attestations</h3>
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {notification.issuer === address
                    ? `You attested to ${notification.recipient.slice(0, 6)}...${notification.recipient.slice(-4)}`
                    : `${notification.issuer.slice(0, 6)}...${notification.issuer.slice(-4)} attested to you`}
                </p>
                <p className="text-sm text-gray-600 mt-1">{notification.metadata}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Score: {notification.score}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 