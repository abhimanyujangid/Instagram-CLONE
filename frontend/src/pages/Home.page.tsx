import { NavbarMinimal } from '@/components/NavBar/NavbarMinimal';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { AuthenticationForm } from '@/components/Auth/AuthenticationForm';

export function HomePage() {
  return (
    <>
      {/* <Welcome />
      <ColorSchemeToggle /> */}
      <NavbarMinimal/>
      {/* <AuthenticationForm />   */}
    </>
  );
}
