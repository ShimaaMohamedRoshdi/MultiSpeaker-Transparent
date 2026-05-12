import type { Speaker, SpeakerRole } from '../types/transcript'

export const SPEAKER_ROLES: Array<{
  role: SpeakerRole
  label: string
  color: string
  badge: string
}> = [
  { role: 'Judge', label: 'القاضي', color: '#f8c06d', badge: 'JG' },
  { role: 'Prosecutor', label: 'النيابة', color: '#fb7185', badge: 'PR' },
  { role: 'Defendant', label: 'المتهم', color: '#38bdf8', badge: 'DF' },
  { role: 'Lawyer', label: 'المحامي', color: '#a78bfa', badge: 'LW' },
  { role: 'Witnesses', label: 'الشهود', color: '#34d399', badge: 'WT' },
  { role: 'Experts', label: 'الخبراء', color: '#facc15', badge: 'EX' },
  { role: 'CivilPlaintiff', label: 'المدعي بالحق المدني', color: '#fb923c', badge: 'CP' },
]

export const SPEAKERS: Speaker[] = [
  {
    id: 1,
    name: 'Justice Hala Mansour',
    role: 'Judge',
    roleLabel: 'القاضي',
    color: '#f8c06d',
    avatar: 'JG',
  },
  {
    id: 2,
    name: 'Noura Hassan',
    role: 'Prosecutor',
    roleLabel: 'النيابة',
    color: '#fb7185',
    avatar: 'PR',
  },
  {
    id: 3,
    name: 'Omar Said',
    role: 'Defendant',
    roleLabel: 'المتهم',
    color: '#38bdf8',
    avatar: 'DF',
  },
  {
    id: 4,
    name: 'Yara Abdallah',
    role: 'Lawyer',
    roleLabel: 'المحامي',
    color: '#a78bfa',
    avatar: 'LW',
  },
  {
    id: 5,
    name: 'Mahmoud Salem',
    role: 'Witnesses',
    roleLabel: 'الشهود',
    color: '#34d399',
    avatar: 'WT',
  },
  {
    id: 6,
    name: 'Dr. Lina Farouk',
    role: 'Experts',
    roleLabel: 'الخبراء',
    color: '#facc15',
    avatar: 'EX',
  },
  {
    id: 7,
    name: 'Karim Abdelrahman',
    role: 'CivilPlaintiff',
    roleLabel: 'المدعي بالحق المدني',
    color: '#fb923c',
    avatar: 'CP',
  },
]

export const SPEAKER_MAP = SPEAKERS.reduce<Record<number, Speaker>>((acc, speaker) => {
  acc[speaker.id] = speaker
  return acc
}, {})

export const ROLE_MAP = SPEAKER_ROLES.reduce<Record<SpeakerRole, (typeof SPEAKER_ROLES)[0]>>(
  (acc, role) => {
    acc[role.role] = role
    return acc
  },
  {} as Record<SpeakerRole, (typeof SPEAKER_ROLES)[0]>,
)
