import {
  FC,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";

type HintContextType = (text: string, position?: PositionType) => {};

const DEFAULT_VALUE = () => ({});

export const HintContext = createContext<HintContextType>(DEFAULT_VALUE);

interface Props {
  children: ReactNode;
}

type RootType = HTMLElement | null;
type PositionType = "default";

export const HintProvider: FC<Props> = ({ children }) => {
  const [root, setRoot] = useState<RootType>(null);

  useEffect(() => {
    setRoot(document.querySelector(":root") as RootType);
  }, []);

  const handleGetHint = (text: string, position: PositionType = "default") => {
    if (root) {
      return {
        onMouseEnter: () => {
          root.style.setProperty("--cursor-opacity", "0.8");
          root.style.setProperty("--cursor-hint-text", `'${text}'`);
          root.style.setProperty("--cursor-hint-display", "flex");
        },
        onMouseLeave: () => {
          root.style.setProperty("--cursor-opacity", "0.5");
          root.style.setProperty("--cursor-hint-text", "''");
          root.style.setProperty("--cursor-hint-display", "none");
        },
      };
    }

    return {};
  };

  return (
    <HintContext.Provider value={handleGetHint}>
      {children}
    </HintContext.Provider>
  );
};

export const useHint = () => useContext(HintContext);
