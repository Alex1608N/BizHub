import React from "react";

export default function Loading() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="hidden md:block text-right space-y-2">
          <div className="h-4 w-24 bg-gray-100 rounded-lg ml-auto"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-lg ml-auto"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-32">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-3 w-20 bg-gray-100 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-12 w-12 bg-gray-50 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 h-80 shadow-sm">
           <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
              <div className="h-6 w-40 bg-gray-200 rounded-lg"></div>
           </div>
           <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-xl w-full"></div>
              ))}
           </div>
        </div>
        <div className="bg-gray-200 p-8 rounded-2xl h-80 shadow-sm"></div>
      </div>
    </div>
  );
}
