import { useAuth } from '../../contexts/AuthContext'

export default function VolunteerWelcomeScreen() {
  const { profile, signOut } = useAuth()

  return (
    <div className="px-4 pt-6 pb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-headline font-black text-2xl uppercase italic">Volunteer</h1>
        <button
          onClick={signOut}
          className="bg-surface-variant border-2 border-black px-3 py-1.5 font-headline font-black text-xs uppercase italic drop-block rounded-xl active:scale-95"
        >
          Logout
        </button>
      </div>

      <div className="bg-primary-container border-4 border-black p-6 drop-block rounded-3xl">
        <p className="font-headline font-black text-3xl uppercase italic text-on-primary-container leading-tight">
          Welcome Volunteer
        </p>
        <p className="font-body font-bold text-on-primary-container opacity-80 mt-2">
          {profile?.team_name ?? 'Volunteer Team'}
          {profile?.team_code ? ` · ${profile.team_code}` : ''}
        </p>
      </div>

      <div className="bg-surface border-4 border-black p-5 rounded-3xl">
        <p className="font-body font-bold text-sm text-on-surface-variant">
          This is a placeholder volunteer page.
        </p>
      </div>
    </div>
  )
}
