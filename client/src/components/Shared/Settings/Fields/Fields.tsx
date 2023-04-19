import React, {
  FC,
  Dispatch,
  useEffect,
  useReducer,
  SetStateAction,
} from "react";
import { SETTINGS } from "@utils/constants";
import { Form } from "@components/Shared/Form/Form";
import { DeskType, SettingsType } from "@utils/common/types";

interface Props {
  desk?: DeskType;
  isWithName?: boolean;
  setForm: Dispatch<SetStateAction<SettingsType | null>>;
}

export const Fields: FC<Props> = ({ isWithName, desk, setForm }) => {
  const [settings, setSettings] = useReducer(
    (prev: SettingsType, next: Partial<SettingsType>) => ({ ...prev, ...next }),
    {
      name: "",
      wins: SETTINGS.MIN.WINS,
      stages: SETTINGS.MIN.STAGES,
      players: SETTINGS.MIN.PLAYERS,
    }
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
        <Form.Field label="Name">
          <Form.Input.Text
            value={settings.name}
            setValue={(value) => setSettings({ name: value })}
          />
        </Form.Field>
      )}
      <Form.Field label="Players">
        <Form.Input.Number
          value={settings.players}
          min={SETTINGS.MIN.PLAYERS}
          max={SETTINGS.MAX.PLAYERS}
          setValue={(value) => setSettings({ players: value })}
        />
      </Form.Field>
      <Form.Field label="Max wins">
        <Form.Input.Number
          value={settings.wins}
          min={SETTINGS.MIN.WINS}
          max={SETTINGS.MAX.WINS}
          setValue={(value) => setSettings({ wins: value })}
        />
      </Form.Field>
      <Form.Field label="Rolls">
        <Form.Input.Number
          value={settings.stages}
          min={SETTINGS.MIN.STAGES}
          max={SETTINGS.MAX.STAGES}
          setValue={(value) => setSettings({ stages: value })}
        />
      </Form.Field>
    </>
  );
};
