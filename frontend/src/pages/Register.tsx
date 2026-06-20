import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    await register(email, password);
    navigate("/");
  };

  return (
    <AuthForm
      title="Create your Commitly account"
      submitLabel="Register"
      onSubmit={handleRegister}
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        to: "/login",
      }}
    />
  );
}
