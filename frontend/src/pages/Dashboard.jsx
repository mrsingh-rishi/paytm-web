import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [account, setAccount] = useState({});
  const token = localStorage.getItem("token");

  async function handleSearchChange(e) {
    setSearch(e.target.value);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/bulk?filter=" + search,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  async function fetchUserData() {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setUserData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchBalance() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setAccount(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchAllUsers() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/all",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {}
  }
  useEffect(() => {
    fetchUserData();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [userData]);

  return (
    <div>
      <nav className="flex justify-between p-5">
        <h1 className="text-3xl font-bold">Payments App</h1>
        <div className="flex">
          <h2 className="text-2xl">Hello, {userData && userData.firstName}</h2>
          <div className="h-10 w-10 mx-2 rounded-full bg-slate-200 flex justify-center">
            <h2 className="text-xl text-center font-semibold mt-[5px] mr-[2px]">
              {userData.firstName && userData.firstName[0]}
            </h2>
          </div>
        </div>
      </nav>
      <hr />
      <div className="p-5">
        <h1 className="text-2xl font-bold">Your Balance ${account.balance}</h1>
        <div className="mt-5">
          <h1 className="text-2xl font-bold">Users</h1>
          <input
            onChange={handleSearchChange}
            type="text"
            className="w-full p-3 mt-3 focus:border-slate-400 border-slate-200 border-2 rounded-xl"
            placeholder="Search users....."
          />
          {users.map((user) => {
            // console.log(user);
            return (
              <div>
                <UserComponent key={user._id} user={user} />{" "}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const UserComponent = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between mt-4 p-1">
      <div className="flex">
        <div className="h-10 w-10 mx-2 rounded-full bg-slate-200 flex justify-center">
          <h2 className="text-xl text-center font-semibold mt-[5px] mr-[2px]">
            {user.firstName[0]}
          </h2>
        </div>
        <h1 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h1>
      </div>
      <button
        className="bg-black text-white rounded-2xl font-semibold py-3 px-4"
        onClick={(e) => {
          navigate(
            "/send?id=" +
              user._id +
              "&name=" +
              user.firstName +
              " " +
              user.lastName
          );
        }}
      >
        Send Money
      </button>
    </div>
  );
};

export default Dashboard;
