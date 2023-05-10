import Image from "next/image";
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
  <div className="form__input">
    <Image
      fill
      alt="grunge-line"
      className="form__line"
      src="/images/grunge-line.png"
    />
    <input
      value={value}
      className="form__input form__input--text"
      onChange={(e) => setValue(e.target.value.toString())}
    />
  </div>
);

interface Number extends Input {
  min: number;
  max: number;
  value: number;
  setValue: (value: number) => void;
}

const Number: FC<Number> = ({ min, max, value, setValue }) => {
  const handleSetValue = (value: number) => {
    if (value >= min && value <= max) {
      setValue(value);
    }
  };

  return (
    <div className="form__input">
      <span className="form__value">{value}</span>
      <Image
        fill
        alt="grunge-line"
        className="form__line"
        src="/images/grunge-line.png"
      />
      <Image
        width={20}
        height={20}
        alt="arrow-up"
        src="/images/grunge-arrow-right.png"
        onClick={() => handleSetValue(value + 1)}
        className={`form__arrow form__arrow--up ${
          value >= max ? "form__arrow--disabled" : ""
        }`}
      />
      <Image
        width={20}
        height={20}
        alt="arrow-down"
        src="/images/grunge-arrow-right.png"
        onClick={() => handleSetValue(value - 1)}
        className={`form__arrow form__arrow--down ${
          value <= min ? "form__arrow--disabled" : ""
        }`}
      />
    </div>
  );
};

Form.Input = Input;
Form.Field = Field;

Input.Text = Text;
Input.Number = Number;
