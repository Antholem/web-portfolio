import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./config/firebase";

function App() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user); // Log user information
      alert(`Welcome, ${user.displayName}!`);
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-light text-dark">
      <h1 className="text-4xl font-heading mb-6">Landing Page</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-brand text-white rounded-lg shadow-md hover:bg-dark"
      >
        Login With Google
      </button>
    </main>
  );
}

export default App;
