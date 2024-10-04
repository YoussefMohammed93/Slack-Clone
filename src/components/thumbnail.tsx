import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[300px] bordeer rounded-lg my-2 cursor-zoom-in">
          <Image
            src={url}
            alt="Message image"
            className="object-cover size-full rounded-md border"
            width={100}
            height={100}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[90vw] border-none bg-transparent p-0 shadow-none md:max-w-[800px]">
        <Image
          src={url}
          alt="Message image"
          className="w-full h-[500px] rounded-md"
          width={800}
          height={0}
        />
      </DialogContent>
    </Dialog>
  );
};
