import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { SignInUser } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (data) => {
    console.log(data);
    setLoginError("");
    
    try {
      const result = await SignInUser(data.email, data.password);
      console.log("after login", result.user);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <h3 className="text-3xl text-center">Welcome back</h3>
          <p className="text-center">Please Login</p>
          
          {loginError && (
            <div className="alert alert-error">
              <span>{loginError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(handleLogin)}>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input"
                placeholder="Email"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is required.</p>
              )}

              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                className="input"
                placeholder="Password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500">Password is required.</p>
              )}

              {errors.password?.type === "minLength" && (
                <p className="text-red-500">Password must have 6 characters.</p>
              )}

              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>
              <button type="submit" className="btn btn-neutral mt-4">
                Login
              </button>
            </fieldset>
            <p>
              New to Style Decor?{" "}
              <Link className="text-blue-400 underline" to="/register">
                Register
              </Link>
            </p>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Login;
