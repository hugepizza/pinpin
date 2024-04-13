"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import "./style.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pin } from "@/types";

type Props = ComponentProps<"button"> & {
  data: Partial<Pin>;
  pendingText?: React.ReactNode;
};

function PublishButton({ data, children, pendingText, ...props }: Props) {
  const [pending, setPending] = useState(false);
  const { push } = useRouter();
  const onClick = () => {
    setPending(true);
    // fetch("/api/publish", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ a: 1 }),
    // })
    //   .then(() => {
    //     push("/");
    //     toast({
    //       title: "发车成功",
    //       description: "有意向的车友会通过小飞机联系你",
    //     });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
    //   .finally(() => setPending(false));
  };
  return (
    <Button
      onClick={onClick}
      className={cn(props.className, `${pending ? "pending" : ""}`)}
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
export default PublishButton;
