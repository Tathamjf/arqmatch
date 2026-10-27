import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Auth.css';
import { useAuth } from './context/useAuth';

interface LoginLocationState {
  from?: string;
  pendingProjectId?: number;
}

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState = location.state as LoginLocationState | null;
  const destination = locationState?.from ?? '/';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (!password) {
      setError('Informe sua senha.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(destination, {
        replace: true,
        state: locationState?.pendingProjectId
          ? { pendingProjectId: locationState.pendingProjectId }
          : undefined,
      });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-brand">Arq<strong>Match</strong></div>
        <h1 id="login-title">Entrar na conta</h1>
        <p className="auth-description">Acesse seus projetos, carrinho e pedidos.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error && !isValidEmail(email))}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(error && !password)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <Link className="auth-link" to="/cadastro">
          Ainda não tenho cadastro
        </Link>
      </section>
    </main>
  );
}

export default Login;
