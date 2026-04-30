import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import SocialLogin from "./SocialLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  const handleRegistration = async (data) => {
    console.log(data);
    setRegisterError("");

    try {
      const profileImg = data.photo[0];

      // 1. Store the image in form data
      const formData = new FormData();
      formData.append("image", profileImg);

      // 2. Send the photo to store and get the URL
      const image_API_URL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_key
      }`;

      const imgResponse = await axios.post(image_API_URL, formData);
      const photoURL = imgResponse.data.data.url;

      // 3. Register user with backend
      const result = await registerUser(
        data.email,
        data.password,
        data.name,
        photoURL
      );

      console.log("User registered:", result.user);
      
      // Update user profile
      const userProfile = {
        displayName: data.name,
        photoURL: photoURL,
      };

      await updateUserProfile(userProfile);
      console.log("User profile updated.");
      
      navigate(location.state || "/");
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <h3 className="text-3xl text-center">Create Account</h3>
          <p className="text-center">Please Register</p>
          
          {registerError && (
            <div className="alert alert-error">
              <span>{registerError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(handleRegistration)}>
            <fieldset className="fieldset">
              {/* name field */}
              <label className="label">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input"
                placeholder="Your Name"
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500">Name is required.</p>
              )}

              {/* photo image field */}
              <label className="label">Photo</label>
              <input
                type="file"
                {...register("photo", { required: true })}
                className="file-input"
                placeholder="Your Photo"
              />

              {errors.photo?.type === "required" && (
                <p className="text-red-500">Photo is required.</p>
              )}

              {/* email field */}
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
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
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
              {errors.password?.type === "pattern" && (
                <p className="text-red-500">
                  Password must contain uppercase, lowercase, number and special character.
                </p>
              )}

              <button type="submit" className="btn btn-neutral mt-4">
                Register
              </button>
            </fieldset>
            <p>
              Already have an account?{" "}
              <Link className="text-blue-400 underline" to="/login">
                Login
              </Link>
            </p>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Register;
