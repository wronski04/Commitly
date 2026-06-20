import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigate("/");
  };

  return (
    <AuthForm
      title="Sign in to Commitly"
      submitLabel="Sign in"
      onSubmit={handleLogin}
      footer={{
        text: "Don't have an account?",
        linkText: "Register",
        to: "/register",
      }}
    />
  );
}
