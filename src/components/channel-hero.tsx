interface ChannelHeroProps {
  name: string;
}

export const ChannelHero = ({ name }: ChannelHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="flex items-start justify-start mb-2 text-2xl font-bold">
        # {name}
      </p>
      <p className="font-normal to-slate-800 mb-4">
        This is the very beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};
