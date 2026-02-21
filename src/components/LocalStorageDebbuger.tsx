"use client";

import { useEffect } from "react";

export default function LocalStorageDebugger() {
  useEffect(() => {
    console.log("===== LOCALSTORAGE DEBUG =====");

    if (typeof window === "undefined") return;

    // List all keys and values
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(value!);
          console.log(`Key: "${key}" →`, parsed);
        } catch {
          console.log(`Key: "${key}" →`, value);
        }
      }
    }

    console.log("===== END LOCALSTORAGE DEBUG =====");
  }, []);

  return null;
}