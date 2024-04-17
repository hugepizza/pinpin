import Image from "next/image";
import youtubeIcon from "./svgs/youtube.svg";
import spotifyIcon from "./svgs/spotify.svg";
import netflixIcon from "./svgs/netflix.svg";
import duolingoIcon from "./svgs/duolingo.svg";
import chatgptIcon from "./svgs/chatgpt.svg";
import nintendoIcon from "./svgs/nintendo.svg";
import appleIcon from "./svgs/apple.svg";
import { BuildinServices } from "@/types";
import { cn } from "@/lib/utils";
function ServiceLogo({ service }: { service: string }) {
  switch (service.toLowerCase()) {
    case "youtube":
      return <Image className="inline" src={youtubeIcon} alt="youtube" />;
    case "spotify":
      return <Image className="inline" src={spotifyIcon} alt="spotify" />;
    case "netflix":
      return <Image className="inline" src={netflixIcon} alt="spotify" />;
    case "duolingo":
      return <Image className="inline" src={duolingoIcon} alt="spotify" />;
    case BuildinServices.任天堂:
      return <Image className="inline" src={nintendoIcon} alt="chatgpt" />;
    case BuildinServices.ChatGPT:
      return <Image className="inline" src={chatgptIcon} alt="chatgpt" />;
    case BuildinServices["Apple"]:
      return <Image className="inline" src={appleIcon} alt="telegram" />;
    default:
      return (
        <div
          className={cn("flex justify-center items-center self-center size-8")}
        >
          <div
            className={cn(
              "flex justify-center items-center text-background text-xl align-middle w-full h-full rounded-full",
              service[0].toUpperCase().charCodeAt(0) % 2 === 0
                ? "bg-secondary"
                : "bg-primary"
            )}
          >
            {<div>{service[0].toUpperCase()}</div>}
          </div>
        </div>
      );
  }
}

export default ServiceLogo;
