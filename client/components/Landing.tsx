import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "./hover-border-gradient";
import { useRouter } from "next/navigation";
export function Landing() {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <BackgroundBeamsWithCollision>
      <div className="d-flex flex-row ">
        <h1 className={cn(
          "text-7xl md:text-8xl font-bold text-center",
          theme === "dark"
            ? "bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
            : "text-black"
        )}>
          <span className="text-pink-500">
            Task
          </span>Management
        </h1>
        <p className={cn(
          "mt-4 font-normal text-base max-w-lg text-center mx-auto",
          theme === "dark" ? "text-neutral-300" : "text-gray-600"
        )}>
          Effortlessly manage tasks with TaskMaster. Our interface helps you
          organize, prioritize, and accomplish goals. Stay productive and
          focused with our powerful task management tools.
        </p>
        <div className="space-x-4 mt-6 mb-20 md:mb-0 ml-[38%]">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black px-4 bg-white text-black dark:text-white flex items-center space-x-2"
            onClick={() => router.push('/tasks')}
          >
            <span>Manage your task now!</span>
          </HoverBorderGradient>
        </div>
      </div>
    </BackgroundBeamsWithCollision>

  );
}
