import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  async function handleTransfer() {
    try {
      const amount1 = parseInt(amount);
      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          to: id,
          amount: amount1,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setTimeout(() => navigate("/dashboard"), 5000);
    } catch (error) {}
  }
  return (
    <div className="flex bg-[#F3F4F6] h-[100vh] ">
      <div className="m-auto bg-white w-[500px] h-[380px] rounded-lg p-6 shadow-xl">
        <h1 className="text-4xl font-bold ml-[32%]">Send Money</h1>
        <div className="mt-14">
          <div className=" flex justify-self-center">
            <div className="h-16 w-16 rounded-full bg-green-500 flex">
              <p className="text-xl font-bold mx-auto my-auto">{name[0]}</p>
            </div>
            <h2 className="my-auto text-3xl font-bold ml-3">{name}</h2>
          </div>
          <p className="font-bold mt-3">Amount (in Rs) </p>
          <input
            className="w-[100%] border-2 p-2 my-2 rounded-lg"
            placeholder="Enter Amount"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="bg-green-500 w-[100%] p-3 rounded-lg text-xl font-semibold text-white mt-4"
            onClick={handleTransfer}
          >
            Send Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
