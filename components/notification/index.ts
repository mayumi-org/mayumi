import { Notification as _Notification, info } from './notification'
export type { NotificationProps } from './notification'

type InnerNotification = typeof _Notification

interface NotificationInterface extends InnerNotification {
  info: typeof info
}

export const Notification = _Notification as NotificationInterface
Notification.info = info
