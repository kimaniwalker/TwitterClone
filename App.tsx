import { UserPreferenceWrapper } from '@/utils/context/userPreferences'
import Navigator from '@/utils/screens'

export default function App() {

  return (
    <UserPreferenceWrapper>
      <Navigator />
    </UserPreferenceWrapper>
  )
}