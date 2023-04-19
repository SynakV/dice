import React, { FC, ReactNode } from "react";

interface Form {}

export const Form = () => {};

interface Field {
  label: string;
  children: ReactNode;
}

const Field: FC<Field> = ({ label, children }) => (
  <div className="form__field">
    <span className="form__label">{label}:</span>
    {children}
  </div>
);

interface Input {}

export const Input = () => {};

interface Text extends Input {
  value: string;
  setValue: (value: string) => void;
}

export const Text: FC<Text> = ({ value, setValue }) => (
  <input
    value={value}
    className="form__input"
    onChange={(e) => setValue(e.target.value.toString())}
  />
);

interface Number extends Input {
  min: number;
  max: number;
  value: number;
  setValue: (value: number) => void;
}

const Number: FC<Number> = ({ min, max, value, setValue }) => (
  <input
    min={min}
    max={max}
    type="number"
    value={value}
    className="form__input form__input--number"
    onChange={(e) => setValue(+e.target.value)}
  />
);

Form.Input = Input;
Form.Field = Field;

Input.Text = Text;
Input.Number = Number;
