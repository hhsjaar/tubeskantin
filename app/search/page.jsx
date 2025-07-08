// app/search/page.jsx
import { Suspense } from "react";
import SearchPage from "./SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Memuat hasil pencarian...</div>}>
      <SearchPage />
    </Suspense>
  );
}
