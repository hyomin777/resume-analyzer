import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import SavedResultsList from "../components/SavedResultsList";

export default function Home() {
  const { loggedIn, login } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!loggedIn) {
    return (
      <div>
        {showSignup ? (
          <>
            <SignupForm onSignup={login} />
            <div className="text-center mt-2">
              이미 계정이 있으신가요?{" "}
              <button className="text-blue-600 underline cursor-pointer" onClick={() => setShowSignup(false)}>
                로그인하기
              </button>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={login} />
            <div className="text-center mt-2">
              계정이 없으신가요?{" "}
              <button className="text-blue-600 underline cursor-pointer" onClick={() => setShowSignup(true)}>
                회원가입
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <SavedResultsList />
    </main>
  );
}
