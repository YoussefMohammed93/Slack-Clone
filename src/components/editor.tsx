import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Hint } from "./hint";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "quill/dist/quill.snow.css";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Delta, Op } from "quill/core";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import Quill, { QuillOptions } from "quill";
import { EmojiPopover } from "./emoji-popover";
import { ImageIcon, Smile, XIcon } from "lucide-react";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  variant?: "create" | "update";
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

interface Emoji {
  native: string;
}

const Editor = ({
  onSubmit,
  // onCancel,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const submitRef = useRef(onSubmit);
  const placehloderRef = useRef(placeholder);
  const disabledRef = useRef(disabled);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placehloderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placehloderRef.current,
      modules: {
        toolbar: [["bold", "italic"], ["link"]],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // TODO : Submit form
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: Emoji) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
      />
      <div className="flex flex-col border border-slate-200 focus-within:border-slate-300 focus-within:shadow-sm rounded-lg transition-all duration-150 bg-white overflow-hidden">
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative flex items-center justify-center size-16 group/image">
              <button
                onClick={() => {
                  setImage(null);
                  imageElementRef.current!.value = "";
                }}
                className="hidden group-hover/image:flex items-center justify-center rounded-full size-6 z-[4] border-2 border-white text-white bg-black/75 hover:bg-black transition duration-200 absolute -top-2.5 -right-2.5"
              >
                <XIcon className="size-4" />
              </button>
              <Image
                fill
                alt="Uploaded image"
                src={URL.createObjectURL(image)}
                className="overflow-hidden object-cover rounded-xl border"
              />
            </div>
          </div>
        )}
        <div className="flex gap-1 px-3 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "Hide formating" : "Show formating"}>
            <Button
              disabled={disabled}
              onClick={toggleToolbar}
              size="iconSm"
              variant="ghost"
            >
              <PiTextAa className="size-5" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost">
              <Smile className="size-5" />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-5" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {}}
                disabled={disabled || isEmpty}
                className="bg-emerald-600 hover:bg-emerald-600/85 text-white transition-all duration-150"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {}}
              size="iconSm"
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white shadow-none text-muted-foreground"
                  : "bg-emerald-600 hover:bg-emerald-600/85 text-white transition-all duration-200"
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "flex justify-end text-xs p-2 to-muted-foreground opacity-0 transition-opacity",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Enter</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
