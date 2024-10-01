import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: string;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="flex items-start justify-start mb-2 text-2xl font-bold">
        # {name}
      </p>
      <p className="font-normal to-slate-800 mb-4">
        This channel was created on {format(creationTime, "MMMM do, yyyy")}.
        This is the very beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};
