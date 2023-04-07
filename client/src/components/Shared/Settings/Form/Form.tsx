import React, {
  FC,
  Dispatch,
  useEffect,
  useReducer,
  SetStateAction,
} from "react";
import { DeskType, SettingsType } from "@utils/common/types";

export enum FORM_FIELDS {
  NAME,
  WINS,
  STAGES,
  PLAYERS,
}

interface Props {
  desk?: DeskType;
  isWithName?: boolean;
  setForm: Dispatch<SetStateAction<SettingsType | null>>;
}

export const Form: FC<Props> = ({ isWithName, desk, setForm }) => {
  const [settings, setSettings] = useReducer(
    (prev: SettingsType, next: Partial<SettingsType>) => ({ ...prev, ...next }),
    { name: "", players: 2, wins: 2, stages: 2 }
  );

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  useEffect(() => {
    if (desk) {
      setSettings({
        wins: desk.gameplay.max.wins,
        stages: desk.gameplay.max.stages,
        players: desk.gameplay.max.players,
      });
    }
  }, [desk]);

  return (
    <>
      {isWithName && (
        <div className="form__field">
          <span className="form__label">Name:</span>
          <input
            type="text"
            value={settings.name}
            className="form__input"
            onChange={(e) => setSettings({ name: e.target.value })}
          />
        </div>
      )}
      <div className="form__field">
        <span className="form__label">Players:</span>
        <input
          min={2}
          max={5}
          type="number"
          value={settings.players}
          className="form__input"
          onChange={(e) => setSettings({ players: +e.target.value })}
        />
      </div>
      <div className="form__field">
        <span className="form__label">Max wins:</span>
        <input
          min={1}
          max={5}
          type="number"
          value={settings.wins}
          className="form__input"
          onChange={(e) => setSettings({ wins: +e.target.value })}
        />
      </div>
      <div className="form__field">
        <span className="form__label">Stages:</span>
        <input
          min={2}
          max={5}
          type="number"
          value={settings.stages}
          className="form__input"
          onChange={(e) => setSettings({ stages: +e.target.value })}
        />
      </div>
    </>
  );
};
