import { cn } from "@/lib/utils";
import { BuildinServices } from "@/types";
import Link from "next/link";

function CategoryNav({ active }: { active: string }) {
  Object.entries;
  return (
    <div className="flex flex-wrap bg-background py-3 w-full rounded-sm shadow-sm aspect-auto">
      {Object.entries(BuildinServices).map((service) => (
        <Link
          className={cn(
            "px-2 py-1 mx-1 mt-1 rounded",
            "hover:bg-primary/70 hover:text-background duration-150 ease-in",
            `${
              active.toLocaleLowerCase() === service[1]
                ? "bg-primary text-background"
                : "bg-background text-foreground"
            }`
          )}
          key={service[1]}
          href={`/category/${service[1]}`}
        >
          {service[0]}
        </Link>
      ))}
    </div>
  );
}
export default CategoryNav;
