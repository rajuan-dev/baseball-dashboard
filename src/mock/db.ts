import type {
  AdminUser,
  Category,
  Drill,
  Earning,
  NotificationItem,
  Report,
  SettingsContent,
  Situation,
} from '@/types/entities'
import baseballGroundsDemoImage from '@/assets/baseball-grounds-demo.jpg'

const placeholderCover =
  'https://placehold.co/800x600/f3efe7/111f5a?text=Upload'
const situationDemoImage = baseballGroundsDemoImage
const placeholderAvatar =
  'https://placehold.co/200x200/f2f4f8/111f5a?text=Admin'

const settingsParagraph = `Iacus nulla eu netus pretium. Pellentesque scelerisque tellus nisl eu nisl sed senectus nunc. Porta sollicitudin vel elit varius nulla sit diam sed. Bibendum elit facilisi nulla viverra augue pellentesque gravida morbi.

Diam pellentesque orci eget gravida cursus. Ut ut nulla sapien eget vitae at eget pretium. Tristique nibh ipsum iaculis quam. Vestibulum magna cursus facilisis adipiscing cras dui. Risus auctor faucibus orci tortor tristique elit. Sit tincidunt id felis malesuada placerat ultricies enim. Purus ut congue ornare id sed. Enim libero tincidunt facilisis non facilisis mattis praesent. Magna volutpat at cras urna adipiscing vitae velit enim volutpat.

Ut suscipit cursus id mauris. Accumsan egestas sit arcu sed. Feugiat tortor pharetra id ipsum elit diam viverra tortor. Mattis tincidunt eget ut nunc in. Mauris ipsum ut purus laoreet nisi eu viverra velit adipiscing. Diam sit cursus id semper sit.`

const categories: Category[] = [
  {
    id: 'cat_pitching',
    name: 'Pitching Mechanics',
    subtitle: 'Precision control and arm path development',
    cover: placeholderCover,
    icon: '⚾',
    accentIcon: 'radio-button-on-outline',
    accessLevel: 'Free',
    totalDrills: 32,
  },
  {
    id: 'cat_velocity',
    name: 'Velocity Drills',
    subtitle: 'Explosive lower-body and release sequencing',
    cover: placeholderCover,
    icon: '🚀',
    accentIcon: 'speedometer-outline',
    accessLevel: 'Premium',
    totalDrills: 18,
  },
  {
    id: 'cat_mental',
    name: 'Mental Strategy',
    subtitle: 'Focus, discipline, and pressure management',
    cover: placeholderCover,
    icon: '🧠',
    accentIcon: 'analytics-outline',
    accessLevel: 'Premium',
    totalDrills: 12,
  },
  {
    id: 'cat_hitting',
    name: 'Hitting Fundamentals',
    subtitle: 'Barrel path, timing, and launch angle',
    cover: placeholderCover,
    icon: '🏏',
    accentIcon: 'baseball-outline',
    accessLevel: 'Free',
    totalDrills: 24,
  },
]

const drills: Drill[] = [
  {
    id: 'drill_power_swing',
    name: 'Power Swing Mechanics',
    categoryId: 'cat_hitting',
    description:
      'Build balanced lower half loading, rotation timing, and clean finish mechanics.',
    cover: placeholderCover,
    listIcon: 'baseball-outline',
    steps: ['Load into an athletic base.', 'Rotate through contact.', 'Finish balanced.'],
    equipment: [{ name: 'Baseball bat' }, { name: 'Batting helmet' }, { name: 'Baseballs' }],
    focusPoints: [
      { title: 'Lower half', description: 'Drive from the ground up.' },
      { title: 'Finish', description: 'Stay balanced after contact.' },
    ],
    accessLevel: 'Premium',
    createdAt: '2024-10-24T14:22:00Z',
  },
  {
    id: 'drill_catcher_pop',
    name: 'Catcher Pop-Time Drill',
    categoryId: 'cat_velocity',
    description:
      'Improve transfer speed, release compactness, and footwork under pressure.',
    cover: placeholderCover,
    listIcon: 'flame-outline',
    steps: ['Receive with clean hands.', 'Transfer quickly.', 'Throw through the target.'],
    equipment: [{ name: 'Catcher gear' }, { name: 'Baseballs' }, { name: 'Stopwatch' }],
    focusPoints: [
      { title: 'Transfer speed', description: 'Keep the exchange compact.' },
      { title: 'Footwork', description: 'Gain ground toward second.' },
    ],
    accessLevel: 'Free',
    createdAt: '2024-10-22T11:12:00Z',
  },
  {
    id: 'drill_command',
    name: 'Command Ladder',
    categoryId: 'cat_pitching',
    description:
      'Target-based mound sequence that sharpens command across four quadrants.',
    cover: placeholderCover,
    listIcon: 'ellipse-outline',
    steps: ['Set four command targets.', 'Throw five pitches per target.', 'Track misses after each round.'],
    equipment: [{ name: 'Baseballs' }, { name: 'Strike zone target' }, { name: 'Clipboard' }],
    focusPoints: [
      { title: 'Intent', description: 'Commit to the target before delivery.' },
      { title: 'Adjustment', description: 'Correct misses immediately.' },
    ],
    accessLevel: 'Premium',
    createdAt: '2024-10-20T16:40:00Z',
  },
  {
    id: 'drill_focus_reset',
    name: 'Inning Reset Routine',
    categoryId: 'cat_mental',
    description:
      'Pre-pitch reset flow for high-pressure innings and mid-game recovery.',
    cover: placeholderCover,
    listIcon: 'shield-outline',
    steps: ['Step off the rubber.', 'Take one controlled breath.', 'Lock onto the next pitch plan.'],
    equipment: [{ name: 'Practice mound' }, { name: 'Baseballs' }],
    focusPoints: [
      { title: 'Breathing', description: 'Slow the game down before the next pitch.' },
      { title: 'Routine', description: 'Repeat the same reset every time.' },
    ],
    accessLevel: 'Premium',
    createdAt: '2024-10-19T09:05:00Z',
  },
]

const situations: Situation[] = [
  {
    id: 'situation_1',
    title: 'Infield Shift',
    category: 'Featured Situation',
    shortLabel: 'IS',
    image: situationDemoImage,
    displayOrder: 1,
    featured: true,
    diagramVariant: 'infield',
    instructions: [{ player: 'P', detail: 'Move into backup position.' }],
    createdAt: '2023-10-24T14:22:00Z',
  },
  {
    id: 'situation_2',
    title: 'Bunt Defense',
    category: 'Specific Situations',
    shortLabel: 'BD',
    image: situationDemoImage,
    displayOrder: 2,
    featured: false,
    diagramVariant: 'infield',
    instructions: [{ player: '1B', detail: 'Charge the ball and call the play.' }],
    createdAt: '2023-10-22T14:22:00Z',
  },
  {
    id: 'situation_3',
    title: 'Double Play Depth',
    category: 'Specific Situations',
    shortLabel: 'DP',
    image: situationDemoImage,
    displayOrder: 3,
    featured: false,
    diagramVariant: 'infield',
    instructions: [{ player: 'SS', detail: 'Cover second and prepare the turn.' }],
    createdAt: '2023-10-20T14:22:00Z',
  },
  {
    id: 'situation_4',
    title: 'Outfield Relay',
    category: 'Specific Situations',
    shortLabel: 'OF',
    image: situationDemoImage,
    displayOrder: 4,
    featured: false,
    diagramVariant: 'outfield',
    instructions: [{ player: 'CF', detail: 'Line up the relay and communicate.' }],
    createdAt: '2023-10-18T14:22:00Z',
  },
  {
    id: 'situation_5',
    title: 'Full Press Defense',
    category: 'Specific Situations',
    shortLabel: 'FP',
    image: situationDemoImage,
    displayOrder: 5,
    featured: false,
    diagramVariant: 'infield',
    instructions: [{ player: 'C', detail: 'Direct traffic and protect home.' }],
    createdAt: '2023-10-15T14:22:00Z',
  },
  {
    id: 'situation_6',
    title: 'Corners In',
    category: 'Specific Situations',
    shortLabel: 'CI',
    image: situationDemoImage,
    displayOrder: 6,
    featured: false,
    diagramVariant: 'infield',
    instructions: [{ player: '3B', detail: 'Crash on bunt and protect the line.' }],
    createdAt: '2023-10-12T14:22:00Z',
  },
  {
    id: 'situation_7',
    title: 'Tag Out Drill',
    category: 'Specific Situations',
    shortLabel: 'TO',
    image: situationDemoImage,
    displayOrder: 7,
    featured: false,
    diagramVariant: 'infield',
    instructions: [{ player: '2B', detail: 'Receive the throw and apply the tag.' }],
    createdAt: '2023-10-08T14:22:00Z',
  },
  {
    id: 'situation_8',
    title: 'Deep Fly Relay',
    category: 'Specific Situations',
    shortLabel: 'DF',
    image: situationDemoImage,
    displayOrder: 8,
    featured: false,
    diagramVariant: 'outfield',
    instructions: [{ player: 'RF', detail: 'Back up the relay lane.' }],
    createdAt: '2023-10-05T14:22:00Z',
  },
]

const reports: Report[] = Array.from({ length: 10 }, (_, index) => ({
  id: `report_${index + 1}`,
  user: 'Robert Fox',
  email: 'fox@email.com',
  phone: '+1 231 3412',
  city: ['Marietta', 'Atlanta', 'Kennesaw', 'Roswell'][index % 4] ?? 'Marietta',
  status: index % 3 === 0 ? 'Resolved' : 'Open',
  message:
    'Vel et commodo et scelerisque aliquam. Sed libero, non praesent felis, sem eget venenatis neque. Massa tincidunt tempor a nisl eu mauris lectus.',
  createdAt: '2024-02-24T10:30:00Z',
}))

const earnings: Earning[] = [
  {
    id: 'earn_1',
    userEmail: 'm.thompson@icloud.com',
    purchaseType: 'Elite Season Pass',
    amount: 249,
    date: '2023-10-24T14:22:00Z',
  },
  {
    id: 'earn_2',
    userEmail: 'coach_wilson@gmail.com',
    purchaseType: 'Drill Pack #4',
    amount: 49.99,
    date: '2023-10-24T12:45:00Z',
  },
  {
    id: 'earn_3',
    userEmail: 'sarah.j.sports@outlook.com',
    purchaseType: 'Annual Membership',
    amount: 899,
    date: '2023-10-23T18:10:00Z',
  },
  {
    id: 'earn_4',
    userEmail: 'pitcher_ace12@yahoo.com',
    purchaseType: 'Single Drill Access',
    amount: 12.5,
    date: '2023-10-23T09:30:00Z',
  },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `earn_repeat_${index}`,
    userEmail: 'k.davis_mba@gmail.com',
    purchaseType: 'Elite Season Pass',
    amount: 249,
    date: '2023-10-22T21:15:00Z',
  })),
]

const notifications: NotificationItem[] = [
  {
    id: 'note_1',
    title: 'Profile report!',
    description: 'A flagged profile requires a moderation review.',
    createdAt: '2024-02-24T12:30:00Z',
    isUnread: true,
  },
  {
    id: 'note_2',
    title: 'A new verification request!',
    description: 'A coach account requested academy verification.',
    createdAt: '2024-02-24T12:30:00Z',
    isUnread: true,
  },
  {
    id: 'note_3',
    title: 'A new user joined',
    description: 'Membership purchase has been completed successfully.',
    createdAt: '2024-02-24T12:30:00Z',
    isUnread: false,
  },
  {
    id: 'note_4',
    title: 'Profile report!',
    description: 'Another report was added to the moderation queue.',
    createdAt: '2024-02-24T12:30:00Z',
    isUnread: false,
  },
]

const adminProfile: AdminUser = {
  id: 'admin_1',
  name: 'Mr. Admin',
  email: 'email@gmail.com',
  role: 'Super Admin',
  image: placeholderAvatar,
  contactNo: '+1 222 333 4444',
}

const settings: SettingsContent = {
  privacyPolicy: settingsParagraph,
  terms: settingsParagraph,
  aboutUs: settingsParagraph,
  updatedAt: new Date().toISOString(),
}

export const mockDb = {
  categories,
  drills,
  situations,
  reports,
  earnings,
  notifications,
  adminProfile,
  settings,
  fullUnlockPrice: 99.99,
}
