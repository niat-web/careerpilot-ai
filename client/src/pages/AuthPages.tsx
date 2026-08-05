import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { GuestOnly } from '../components/Layouts';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <GuestOnly>
      <AuthForm
        mode="register"
        error={error}
        onSubmit={async (data) => {
          setError(null);
          try {
            await signUp(data.full_name, data.email, data.password);
            navigate('/onboarding');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
          }
        }}
      />
    </GuestOnly>
  );
}

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <GuestOnly>
      <AuthForm
        mode="login"
        error={error}
        onSubmit={async (data) => {
          setError(null);
          try {
            await signIn(data.email, data.password);
            navigate('/dashboard');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
          }
        }}
      />
    </GuestOnly>
  );
}
