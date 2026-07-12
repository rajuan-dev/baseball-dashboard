export type AccessLevel = 'Free' | 'Premium'

export type EquipmentItem = {
  name: string
  link?: string | null
}

export type Category = {
  id: string
  name: string
  subtitle: string
  cover: string
  coverUrl?: string
  coverPhoto?: string
  coverPhotoUrl?: string
  icon: string
  iconUrl?: string
  accentIcon: string
  imageUrl?: string
  accessLevel: AccessLevel
  totalDrills: number
}

export type Drill = {
  id: string
  name: string
  categoryId: string
  description: string
  cover: string
  youtubeUrl?: string | null
  listIcon: string
  coverUrl?: string
  coverPhoto?: string
  coverPhotoUrl?: string
  imageUrl?: string
  steps: string[]
  equipment: EquipmentItem[]
  focusPoints: { title: string; description: string }[]
  accessLevel: AccessLevel
  createdAt: string
}

export type Situation = {
  id: string
  title: string
  category: string
  shortLabel: string
  image: string
  imageUrl?: string
  displayOrder: number
  featured: boolean
  diagramVariant: 'infield' | 'outfield'
  instructions: { player: string; detail: string }[]
  createdAt: string
}

export type Report = {
  id: string
  user: string
  email: string
  phone: string
  city: string
  status: 'Open' | 'Resolved'
  message: string
  createdAt: string
}

export type Earning = {
  id: string
  userEmail: string
  purchaseType: string
  amount: number
  date: string
  status?: string
  paymentMethod?: string
  store?: string | null
  environment?: string | null
  currency?: string | null
  source?: string
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  image: string
  contactNo: string
}

export type SettingsContent = {
  privacyPolicy: string
  terms: string
  aboutUs: string
  updatedAt: string | null
}

export type NotificationItem = {
  id: string
  title: string
  description: string
  createdAt: string
  isUnread: boolean
}

export type DashboardOverview = {
  totalPurchases: number
  totalRevenue: number
  monthlyRevenue: number
  categoryCount: number
  totalUsers?: number
  premiumUsers?: number
  totalFreeDrills?: number
  totalPremiumDrills?: number
  recentActivity: Earning[]
}

export type UploadProviderStatus = {
  provider: 'local' | 's3'
  supportsPresignedUploads: boolean
  activeMode: 'server' | 'presigned'
  appBaseUrl: string | null
  localUploadsBasePath: string | null
  localFileBaseUrl: string | null
  maxUploadFileSizeMb: number
}
