import Image from "next/image";
import { useRouter } from "next/router";
import {
  FC,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";

type CursorContextType = (options: OptionsType) => {};

const DEFAULT_VALUE = () => ({});

export const CursorContext = createContext<CursorContextType>(DEFAULT_VALUE);

interface Props {
  children: ReactNode;
}

const POSITION_VALUES = {
  default: 0,
  "top-left": 180,
} as const;

type RootType = HTMLElement | null;
type PositionType = keyof typeof POSITION_VALUES;
type OptionsType = {
  text: string;
  highlight?: boolean;
  position?: PositionType;
};

export const CursorProvider: FC<Props> = ({ children }) => {
  const { pathname } = useRouter();
  const [root, setRoot] = useState<RootType>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (root) {
      root.style.setProperty(
        "--cursor-position",
        `translate(${e.pageX + 10}px, ${e.pageY + 10}px)`
      );
    }
  };

  useEffect(() => {
    setRoot(document.querySelector(":root") as RootType);
  }, []);

  useEffect(() => {
    if (root) {
      root.style.setProperty("--cursor-opacity", "0.5");
      root.style.setProperty("--cursor-hint-text", "''");
      root.style.setProperty("--cursor-hint-display", "none");

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [pathname, root]);

  const handleGetCursor = ({
    text,
    highlight = true,
    position = "default",
  }: OptionsType) => {
    if (root) {
      return {
        onMouseEnter: () => {
          if (highlight) {
            root.style.setProperty("--cursor-opacity", "0.8");
          }
          if (position !== "default") {
            root.style.setProperty(
              "--cursor-rotate",
              `${POSITION_VALUES[position]}deg`
            );
          }
          root.style.setProperty("--cursor-hint-text", `'${text}'`);
          root.style.setProperty("--cursor-hint-display", "flex");
        },
        onMouseLeave: () => {
          if (highlight) {
            root.style.setProperty("--cursor-opacity", "0.5");
          }
          if (position !== "default") {
            root.style.setProperty(
              "--cursor-rotate",
              `${POSITION_VALUES["default"]}deg`
            );
          }
          root.style.setProperty("--cursor-hint-text", "''");
          root.style.setProperty("--cursor-hint-display", "none");
        },
      };
    }

    return {};
  };

  return (
    <CursorContext.Provider value={handleGetCursor}>
      {children}
      <div id="cursor">
        <div id="cursor__rotate">
          <Image
            width={50}
            height={50}
            alt="cursor"
            src="/images/grunge-cursor.png"
          />
        </div>
        <div id="cursor__hint">
          <Image
            fill
            alt="grunge-brush-stroke"
            src="/images/grunge-brush-stroke.png"
          />
          <div id="cursor__text" />
        </div>
      </div>
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
