import React from "react";

const Dashboard = () => {
  return (
    <div>
      <nav className="flex justify-between p-5">
        <h1 className="text-3xl font-bold">Payments App</h1>
        <div className="flex">
          <h2 className="text-2xl">Hello, User</h2>
          <div className="h-10 w-10 mx-2 rounded-full bg-[#7f7f7f] flex justify-center">
            <h2 className="text-xl text-center mt-[5px] mr-[3px]">U</h2>
          </div>
        </div>
      </nav>
      <hr />
      <div className="p-5">
        <h1 className="text-2xl font-bold">Your Balance $500000</h1>
        <div className="mt-5">
          <h1 className="text-2xl font-bold">Users</h1>
          <input
            type="text"
            className="w-full p-3 mt-3 focus:border-slate-400 border-slate-200 border-2 rounded-xl"
            placeholder="Search users....."
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
