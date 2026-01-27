"use client";
import React, { useState } from "react";
import "./login.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/const";
import { loginUser } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import withoutAdminAuth from "@/hooks/withoutAdminAuth";
const Login = () => {
  const router = useRouter();
const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
setLoading(true);

  try {
    const res = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: username, password }),
    });

    const data = await res.json();
    console.log("Admin login response:", data);

    if (
      res.ok &&
      data.success &&
      data.user?.role === "admin"
    ) {
      const userDetailsRes = await fetch(`${baseUrl}/users/userdetails`, {
        method: "GET",
        credentials: "include",
      });

      const userDetailsData = await userDetailsRes.json();

      if (userDetailsRes.ok && userDetailsData.success) {
        // Dispatch Redux user
        dispatch(loginUser(userDetailsData.user));

      toast.success("Login successful");
          router.push("/");
      } else {
        toast.error("Failed to fetch user details.");
      }
    } else {
      toast.error("Invalid credentials or unauthorized role.");
    }
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Something went wrong. Please try again.");
  }
  finally{
    setLoading(false);
  }
};


  return (
    <div className="login-container-admin">
      <div className="login-card">
        <div className="login-header">
          {/* <Image
            src="/logoMain.png"
            alt="Xclusive 3d"
            className="login-logo"
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
          /> */}
          <h2 className="login-title">Transferguard Admin</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          


         <button type="submit" className="login-button" disabled={loading} style={{marginTop:'20px'}}>
  {loading ? <span className="loader"></span> : "Sign In"}
</button>


          <div className="login-footer">
            Browse website? <a href="/">Click here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withoutAdminAuth(Login);
