import Image from "next/image";
import {
  FC,
  useState,
  ReactNode,
  useEffect,
  useContext,
  cloneElement,
  createContext,
} from "react";

const DEFAULT_VALUE = () => <></>;

type CursorContextType = FC<OptionsWithChildren>;

export const CursorContext = createContext<CursorContextType>(DEFAULT_VALUE);

interface Props {
  children: ReactNode;
}

enum POSITIONS {
  default = "default",
  bottom = "bottom",
  "bottom-left" = "bottom-left",
  left = "left",
  "top-left" = "top-left",
  top = "top",
  "top-right" = "top-right",
  right = "right",
}

const CURSOR_POSITIONS = {
  [POSITIONS.default]: 0,
  [POSITIONS.bottom]: 45,
  [POSITIONS["bottom-left"]]: 90,
  [POSITIONS.left]: 135,
  [POSITIONS["top-left"]]: 180,
  [POSITIONS.top]: -135,
  [POSITIONS["top-right"]]: -90,
  [POSITIONS.right]: -45,
} as const;

const HINT_POSITIONS = {
  [POSITIONS.default]: {
    top: 10,
    left: 10,
  },
  [POSITIONS.bottom]: {
    top: 40,
    left: -145,
  },
  [POSITIONS["bottom-left"]]: {
    top: 10,
    left: -300,
  },
  [POSITIONS.left]: {
    top: -40,
    left: -330,
  },
  [POSITIONS["top-left"]]: {
    top: -100,
    left: -290,
  },
  [POSITIONS.top]: {
    top: -140,
    left: -140,
  },
  [POSITIONS["top-right"]]: {
    top: -100,
    left: 10,
  },
  [POSITIONS.right]: {
    top: -50,
    left: 40,
  },
} as const;

type RootType = HTMLElement | null;
type PositionType = keyof typeof POSITIONS;
type OptionsType = {
  id: string;
  hint: string;
  highlight?: boolean;
  isDisable?: boolean;
  position?: PositionType;
};

type OptionsWithChildren = OptionsType & {
  children: JSX.Element;
};

let currentId = "";

export const CursorProvider: FC<Props> = ({ children }) => {
  const [root, setRoot] = useState<RootType>(null);

  const handleMouseMove = (e: MouseEvent) => {
    root?.style.setProperty(
      "--cursor-position",
      `translate(${e.pageX + 10}px, ${e.pageY + 10}px)`
    );
  };

  useEffect(() => {
    setRoot(document.querySelector(":root") as RootType);
    // console.log(window.matchMedia("(pointer:fine)").matches);
  }, []);

  useEffect(() => {
    if (root) {
      document.addEventListener("mousemove", handleMouseMove.bind(this));

      return () => {
        document.removeEventListener("mousemove", handleMouseMove.bind(this));
      };
    }
  }, [root]);

  const handleDefault = (highlight: boolean = true) => {
    if (root) {
      if (highlight) {
        root.style.setProperty("--cursor-opacity", "0.5");
      }
      root.style.setProperty(
        "--cursor-rotate",
        `${CURSOR_POSITIONS["default"]}deg`
      );
      root.style.setProperty(
        "--cursor-hint-position-top",
        `${HINT_POSITIONS["default"].top}px`
      );
      root.style.setProperty(
        "--cursor-hint-position-left",
        `${HINT_POSITIONS["default"].left}px`
      );
      root.style.setProperty("--cursor-hint-text", "''");
      root.style.setProperty("--cursor-hint-display", "none");
    }
  };

  const handleMouseEnter = ({
    id,
    hint,
    isDisable,
    highlight,
    position = "default",
  }: OptionsType) => {
    if (root) {
      currentId = id;
      if (isDisable) {
        return;
      }
      if (highlight) {
        root.style.setProperty("--cursor-opacity", "0.8");
      }
      root.style.setProperty(
        "--cursor-rotate",
        `${CURSOR_POSITIONS[position]}deg`
      );
      root.style.setProperty(
        "--cursor-hint-position-top",
        `${HINT_POSITIONS[position].top}px`
      );
      root.style.setProperty(
        "--cursor-hint-position-left",
        `${HINT_POSITIONS[position].left}px`
      );
      root.style.setProperty("--cursor-hint-text", `'${hint}'`);
      root.style.setProperty("--cursor-hint-display", "flex");
    }
  };

  const handleMouseLeave = ({ isDisable, highlight }: OptionsType) => {
    if (root) {
      currentId = "";
      if (isDisable) {
        return;
      }
      if (highlight) {
        root?.style.setProperty("--cursor-scale", "1");
        root.style.setProperty("--cursor-opacity", "0.5");
      }
      root.style.setProperty(
        "--cursor-rotate",
        `${CURSOR_POSITIONS["default"]}deg`
      );
      root.style.setProperty(
        "--cursor-hint-position-top",
        `${HINT_POSITIONS["default"].top}px`
      );
      root.style.setProperty(
        "--cursor-hint-position-left",
        `${HINT_POSITIONS["default"].left}px`
      );
      root.style.setProperty("--cursor-hint-text", "''");
      root.style.setProperty("--cursor-hint-display", "none");
    }
  };

  const handleMouseDown = ({ highlight, isDisable }: OptionsType) => {
    if (highlight && !isDisable) {
      root?.style.setProperty("--cursor-scale", "0.8");
      root?.style.setProperty("--cursor-opacity", "1");
    }
  };

  const handleMouseUp = ({ highlight, isDisable }: OptionsType) => {
    if (highlight && !isDisable) {
      root?.style.setProperty("--cursor-scale", "1");
      root?.style.setProperty("--cursor-opacity", "0.8");
    }
  };

  const Cursor = ({
    id,
    hint,
    children,
    highlight = true,
    isDisable = false,
    position = "default",
  }: OptionsWithChildren) => {
    const options = {
      id,
      hint,
      position,
      highlight,
      isDisable,
    };

    useEffect(() => () => handleDefault(), []);

    useEffect(() => {
      if (!isDisable && currentId === id) {
        handleMouseEnter(options);
      }
    }, [isDisable]);

    if (currentId === id) {
      root?.style.setProperty("--cursor-hint-text", `'${hint}'`);

      if (isDisable) {
        handleDefault(highlight);
      }
    }

    return cloneElement(children, {
      onMouseUp: handleMouseUp.bind(this, options),
      onMouseDown: handleMouseDown.bind(this, options),
      onMouseEnter: handleMouseEnter.bind(this, options),
      onMouseLeave: handleMouseLeave.bind(this, options),
    });
  };

  return (
    <CursorContext.Provider value={Cursor}>
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
