import Image from "next/image";
import youtubeIcon from "./svgs/youtube.svg";
import spotifyIcon from "./svgs/spotify.svg";
import netflixIcon from "./svgs/netflix.svg";
import duolingoIcon from "./svgs/duolingo.svg";
import chatgptIcon from "./svgs/chatgpt.svg";
import nintendoIcon from "./svgs/nintendo.svg";
import appleIcon from "./svgs/apple.svg";
import { BuildinServices } from "@/types";
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
        <div className="flex justify-center items-center w-[2em]">
          <span className="px-[0.04rem] py-[0.04rem] text-background bg-primary text-xs rounded-sm text-center overflow-hidden overflow-ellipsis whitespace-nowrap">
            {service}
          </span>
        </div>
      );
  }
}

export default ServiceLogo;
