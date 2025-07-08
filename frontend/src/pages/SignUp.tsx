import React from "react";
import Penguin from '../assets/Penguin.svg';
import { Link } from "react-router-dom";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex bg-blue-200 p-24">
      {/* Left Form Section */}
      <div className="w-1/2 bg-white p-10 rounded-3xl flex flex-col justify-between">
        <div>
          <button className="text-2xl mb-6">←</button>
          <h2 className="text-3xl font-semibold mb-4">Sign Up</h2>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none"
            />

            <select className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200">
              <option value="">Select health goal</option>
              <option value="loss">Weight Loss</option>
              <option value="maintain">Maintenance</option>
              <option value="gain">Weight Gain</option>
            </select>

            <input
              type="number"
              placeholder="Current Weight (kg)"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
            />
            <input
              type="number"
              placeholder="Goal Weight (kg)"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
            />
            <input
              type="number"
              placeholder="Height (cm)"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
            />

            <Link to="/home">
                <button
              type="submit"
              className="w-full bg-pink-200 text-black font-semibold py-3 rounded-xl mt-4"
              
            >
              Create account
            </button>
            </Link>
            

            <div className="flex justify-between items-center mt-2">
              <hr className="w-1/3" />
              <span className="text-gray-400 text-sm">or</span>
              <hr className="w-1/3" />
            </div>

            <div className="flex gap-4 mt-2">
              <button className="flex-1 bg-white border rounded-xl py-2 flex justify-center items-center">
                
              </button>
              <button className="flex-1 bg-white border rounded-xl py-2 flex justify-center items-center">
                <span className="text-blue-500 font-semibold">G</span>
              </button>
            </div>

            <p className="text-sm mt-4 text-center">
              Already have an account? <span className="font-semibold">Sign in</span>
            </p>
          </form>
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          Privacy Policy · Terms & Conditions
        </p>
      </div>

      {/* Right Illustration Section */}
      <div className="w-1/2 bg-blue-500 rounded-3xl flex flex-col justify-center items-center p-10 text-white">
        <h1 className="text-3xl font-bold mb-6">GROOV</h1>
        <img src={Penguin} alt="Penguin" className="w-3/4 mb-6" />
        <h2 className="text-xl font-semibold text-center">
          Small lessons that build smart saving habits.
        </h2>
        <p className="text-sm mt-2 text-center">
          Learn how to manage money with fun, kid-friendly lessons.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
