"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useUser } from "@/providers/auth-context";
import { Input } from "../ui/input";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
function Nav() {
  const { user } = useUser();
  const supabase = createClient();

  return (
    <nav className="bg-background top-0 left-0 w-screen min-h-[6vh] shadow-md px-2 sm:px-48 items-center flex z-100">
      <div className="flex flex-row w-full justify-between items-center h-full">
        <div className="flex flex-row items-center h-full gap-2">
          <Link
            className="text-3xl font-bold italic"
            href={"/"}
          >
            拼车
          </Link>{" "}
          <Search />
        </div>
        <div className="space-x-2">
          {user && <Link href={"/me"}>我的</Link>}
          {user && (
            <>
              <Link href={"/publish"}>发车</Link>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  supabase.auth.signOut();
                }}
                href="#"
              >
                登出
              </a>
            </>
          )}
          {!user && <Link href={"/login"}>登入</Link>}
          <Link href={"/"}></Link>
        </div>
      </div>
    </nav>
  );
}
export default Nav;

function Search() {
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusInput = () => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (inputRef.current) {
            push("/?kw=" + inputRef.current.value);
            inputRef.current.blur();
          }
        }
      });
    }
    return () => {
      if (inputRef?.current) {
        inputRef.current.removeEventListener("keydown", () => {});
      }
    };
  }, []);
  return (
    <div className="flex items-center relative" onClick={focusInput}>
      <span className="absolute left-1 icon-[material-symbols--search] h-5 w-5 text-muted-foreground"></span>
      <Input
        ref={inputRef}
        className={cn(
          "h-8 p-2 pl-8 w-36 sm:w-48 border-none focus:bg-muted rounded-full focus-visible:ring-offset-0 focus:ring-0  focus-visible:outline-none",
          "transition-colors duration-300 ease-in-out"
        )}
      ></Input>
    </div>
  );
}
