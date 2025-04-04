import { redis } from "./redis";

export interface AttestationNotification {
  issuer: string;
  recipient: string;
  score: number;
  metadata: string;
  timestamp: number;
}

const ATTESTATION_NOTIFICATION_KEY = "trust-circle:attestations";

export async function saveAttestationNotification(
  notification: AttestationNotification
): Promise<void> {
  if (!redis) return;
  
  const notifications = await getAttestationNotifications();
  notifications.unshift(notification);
  
  // Keep only the last 100 notifications
  const trimmedNotifications = notifications.slice(0, 100);
  
  await redis.set(ATTESTATION_NOTIFICATION_KEY, trimmedNotifications);
}

export async function getAttestationNotifications(): Promise<AttestationNotification[]> {
  if (!redis) return [];
  
  return await redis.get<AttestationNotification[]>(ATTESTATION_NOTIFICATION_KEY) || [];
}

export async function getUserAttestationNotifications(
  address: string
): Promise<AttestationNotification[]> {
  const allNotifications = await getAttestationNotifications();
  return allNotifications.filter(
    (notification) => 
      notification.recipient.toLowerCase() === address.toLowerCase() ||
      notification.issuer.toLowerCase() === address.toLowerCase()
  );
}

export async function clearAttestationNotifications(): Promise<void> {
  if (!redis) return;
  await redis.del(ATTESTATION_NOTIFICATION_KEY);
} 