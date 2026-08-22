"use client";

import { useEffect, useState } from "react";

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <h1 className="font-script text-4xl text-ink sm:text-[42px]">
      {greeting}, {name}!
    </h1>
  );
}
