import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signup",
      {
        firstName: firstName,
        lastName: lastName,
        username: email,
        password: password,
      }
    );
    // console.log(response);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    }
  }

  return (
    <div className="bg-[#7F7F7F] h-[100vh] p-3 flex">
      <div className="bg-white mx-auto  w-[22%] p-5 my-auto rounded-lg ">
        <div className="grid">
          <h1 className="text-3xl font-bold mx-auto">Sign Up</h1>
          <h3 className="text-[#7f7f7f] text-[18px] text-center mx-auto mt-4">
            Enter your information to create an account
          </h3>
        </div>
        <form className="grid m-2 mt-7" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="" className="block font-semibold">
              First Name
            </label>
            <input
              onChange={handleFirstNameChange}
              className=" my-2 p-5 rounded-sm focus:border-slate-400 w-full h-[35px] border-slate-300 border-2"
              type="text"
              name="firstName"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="" className="block font-semibold">
              Last Name
            </label>
            <input
              onChange={handleLastNameChange}
              className=" my-2 p-5 rounded-sm focus:border-slate-400 w-full h-[35px] border-slate-300 border-2"
              type="text"
              name="lastName"
              placeholder="Doe"
            />
          </div>
          <div>
            <label htmlFor="" className="block font-semibold">
              Email
            </label>
            <input
              onChange={handleEmailChange}
              className=" my-2 p-5 rounded-sm focus:border-slate-400 w-full h-[35px] border-slate-300 border-2"
              type="email"
              name="email"
              placeholder="john@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="" className="block font-semibold">
              Password
            </label>
            <input
              onChange={handlePasswordChange}
              className=" my-2 p-5 rounded-sm focus:border-slate-400 w-full h-[35px] border-slate-300 border-2"
              type="password"
              name="password"
            />
          </div>
          <button
            type="submit"
            className="bg-black mt-4 text-white h-14 rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </form>
        <div className="text-black font-semibold grid">
          <p className="mx-auto text-md">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
