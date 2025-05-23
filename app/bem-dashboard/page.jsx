'use client'
import React, { useEffect } from 'react';
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

const BemDashboard = () => {
  const { isBem, user } = useAppContext(); // Using isBem from context
  const router = useRouter();

  useEffect(() => {
    // If the user is not a "bem", redirect to home page
    if (!isBem) {
      toast.error("Access Denied! You must be a BEM member.");
      router.push("/"); // Redirect to home page
    }
  }, [isBem, router]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {isBem ? (
        <>
          <h1 className="text-3xl font-semibold mb-6">BEM Dashboard</h1>
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-medium mb-4">Welcome to the BEM Dashboard</h2>
              <p>This is your control panel where you can manage your activities as a BEM member.</p>
            </div>

            {/* Add more sections relevant to BEM members */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Manage Events</h3>
              <p>Here you can view, add, or edit events hosted by BEM.</p>
              <button
                onClick={() => router.push('/bem-dashboard/events')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                View Events
              </button>
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-3">BEM News</h3>
              <p>Stay updated with the latest news from BEM and campus activities.</p>
              <button
                onClick={() => router.push('/bem-dashboard/news')}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                View News
              </button>
            </div>

            {/* Additional sections could go here */}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">You are not authorized to view this page.</h2>
        </div>
      )}
    </div>
  );
};

export default BemDashboard;
