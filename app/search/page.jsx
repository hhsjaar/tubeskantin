// app/search/page.jsx
import { Suspense } from "react";
import SearchPage from "./SearchPage";

const SearchSkeleton = () => (
  <div className="p-6 md:p-16 animate-pulse">
    <div className="flex flex-col items-center mb-12">
      <div className="h-10 w-64 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 w-40 bg-gray-200 rounded-full"></div>
    </div>
    
    <div className="flex justify-between items-center mb-8">
      <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
      <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden">
          <div className="h-52 bg-gray-200 rounded-t-xl"></div>
          <div className="p-3 bg-gray-100 rounded-b-xl">
            <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Page() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPage />
    </Suspense>
  );
}
