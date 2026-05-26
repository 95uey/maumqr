'use client'

interface ProfileAvatarProps {
  name: string
  photoUrl: string | null
  size?: 'md' | 'lg'
}

export default function ProfileAvatar({ name, photoUrl, size = 'lg' }: ProfileAvatarProps) {
  const initials = name.slice(0, 1)
  const sizeClass = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-base'

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border-4 border-white shadow-lg`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full border-4 border-white shadow-lg bg-amber-100 flex items-center justify-center font-bold text-amber-600`}
    >
      {initials}
    </div>
  )
}
