import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import SavedResultsList from "../components/SavedResultsList";
import LogoutButton from "../components/LogoutButton";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setLoggedIn(true);
  }, []);

  if (!loggedIn) {
    return (
      <div>
        {showSignup ? (
          <>
            <SignupForm onSignup={() => setShowSignup(false)} />
            <div className="text-center mt-2">
              이미 계정이 있으신가요?{" "}
              <button className="text-blue-600 underline" onClick={() => setShowSignup(false)}>
                로그인하기
              </button>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={() => setLoggedIn(true)} />
            <div className="text-center mt-2">
              계정이 없으신가요?{" "}
              <button className="text-blue-600 underline" onClick={() => setShowSignup(true)}>
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
      <div className="text-right my-6">
        <LogoutButton onLogout={() => setLoggedIn(false)} />
      </div>
      <SavedResultsList />
    </main>
  );
}
