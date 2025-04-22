import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-mormedi-blanco.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "mormedi123") {
      navigate("/projects");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1122]">
      <div
        className="p-8 rounded-xl shadow-xl w-full max-w-xs"
        style={{
          background: "linear-gradient(to bottom right, #151530, #262858)",
        }}
      >
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Mormedi Logo" className="w-40" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 bg-[#252942] text-white rounded-md focus:outline-none font-light"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-[#252942] text-white rounded-md focus:outline-none font-light"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#F84C39] text-white py-2 rounded-md hover:bg-[#F83A27] transition font-regular"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
