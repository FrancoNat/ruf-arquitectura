"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const authenticated = isAuthenticated();
      setAllowed(authenticated);

      if (!authenticated) {
        router.replace("/admin");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, router]);

  if (allowed !== true) {
    return (
      <main className="bg-[#f8f4ef] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-md rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-text/70 shadow-sm">
          verificando sesión...
        </div>
      </main>
    );
  }

  return children;
}
