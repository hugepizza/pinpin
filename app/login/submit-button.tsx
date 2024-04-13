"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"button"> & {
  pendingText?: React.ReactNode;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <button
      {...props}
      className={cn(
        props.className,
        `${pending ? "translate-x-[400px] bg-opacity-0" : ""}`,
        "transition-opacity duration-1000",
        "transition-transform duration-100"
      )}
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {isPending ? pendingText : children}
    </button>
  );
}
