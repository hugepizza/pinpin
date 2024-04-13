import Image from "next/image";
import youtubeIcon from "./svgs/youtube.svg";
import spotifyIcon from "./svgs/spotify.svg";
function ServiceLogo({ service }: { service: string }) {
  switch (service.toLowerCase()) {
    case "youtube":
      return <Image className="inline" src={youtubeIcon} alt="youtube" />;
    case "spotify":
      return <Image className="inline" src={spotifyIcon} alt="spotify" />;
    default:
      return (
        <span className="p-1 bg-secondary text-sm rounded-sm">{service}</span>
      );
  }
}

export default ServiceLogo;
