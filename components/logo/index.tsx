import Image from "next/image";
import youtubeIcon from "./svgs/youtube.svg";
import spotifyIcon from "./svgs/spotify.svg";
import netflixIcon from "./svgs/netflix.svg";
import duolingoIcon from "./svgs/duolingo.svg";
import chatgptIcon from "./svgs/chatgpt.svg";
import nintendoIcon from "./svgs/nintendo.svg";
import appleMusicIcon from "./svgs/apple-music.svg";
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
    case BuildinServices["Apple Music"]:
      return <Image className="inline" src={appleMusicIcon} alt="telegram" />;
    default:
      return (
        <span className="px-1 py-[0.125rem] bg-secondary text-sm rounded-sm">
          {service}
        </span>
      );
  }
}

export default ServiceLogo;
