import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { inject } from "@vercel/analytics";
import CookieConsent from "./components/CookieConsent.jsx";
import "./App.css";

const Home = lazy(() => import("./pages/Home.jsx"));
const BlogList = lazy(() => import("./pages/BlogList.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/* ─── Vercel Web Analytics ─── */
inject();

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CookieConsent />
    </>
  );
}
