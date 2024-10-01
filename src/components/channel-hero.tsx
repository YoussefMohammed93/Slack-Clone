// ChannelHero.tsx
import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: number | null; // Allow null for fallback
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  // Log the received creationTime to understand what is being passed
  console.log("ChannelHero - creationTime:", creationTime);

  let formattedDate = "an unknown date";
  if (creationTime && !isNaN(creationTime)) {
    try {
      formattedDate = format(new Date(creationTime), "MMMM do, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="flex items-start justify-start mb-2 text-2xl font-bold">
        # {name}
      </p>
      <p className="font-normal to-slate-800 mb-4">
        This channel was created on {formattedDate}. This is the very beginning
        of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};
