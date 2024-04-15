"use client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

export default function Login() {
  const [auth, setAuth] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const { push } = useRouter();
  const supabase = createClient();
  const [requeting, setRequeting] = useState(false);
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md py-24 gap-2 bg-background my-1">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="signin" className="w-full">
            Sign In
          </TabsTrigger>
          {/* <TabsTrigger value="signup" className="w-full">
            Sign Up
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="signin">
          <div className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              type="email"
              onChange={(e) => {
                setAuth((prev) => ({ ...prev, email: e.target.value }));
              }}
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              onChange={(e) => {
                setAuth((prev) => ({ ...prev, password: e.target.value }));
              }}
            />
            <Button
              type="submit"
              disabled={requeting}
              className={"bg-primary rounded-md px-4 py-2 text-foreground mb-2"}
              onClick={() => {
                setRequeting(true);
                supabase.auth
                  .signInWithPassword({
                    email: auth.email,
                    password: auth.password,
                  })
                  .then((data) => {
                    if (data.error) {
                      setMessage(data.error.message);
                    } else {
                      push("/");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  .finally(() => setRequeting(false));
              }}
            >
              Sign In
            </Button>
            <Button
              type="submit"
              disabled={requeting}
              className={
                "bg-secondary rounded-md px-4 py-2 text-foreground mb-2"
              }
              onClick={() => {
                setRequeting(true);
                supabase.auth
                  .signUp({
                    email: auth.email,
                    password: auth.password,
                  })
                  .then((data) => {
                    if (data.error) {
                      setMessage(data.error.message);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  .finally(() => setRequeting(false));
              }}
            >
              Sign Up
            </Button>
            <div
              className="rounded-md px-4mb-2 self-end text-muted-foreground underline cursor-pointer"
              onClick={() => {
                setRequeting(true);
                supabase.auth
                  .resetPasswordForEmail(auth.email)
                  .then((data) => {
                    if (data.error) {
                      setMessage(data.error.message);
                    } else {
                      setMessage("check your email index box");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  .finally(() => setRequeting(false));
              }}
            >
              Reset Password
            </div>
            {message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {message}
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="signup"></TabsContent>
      </Tabs>
    </div>
  );
}
