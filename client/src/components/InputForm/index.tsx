import React, { FC } from "react";

interface Props {
  id: string;
  inputType: string;
  labelName: string | undefined;
  placeholder: string | undefined;
  className: string;
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputForm: FC<Props> = ({
  id,
  inputType,
  placeholder,
  labelName,
  value,
  className,
  onChangeHandler,
}) => {
  return (
    <>
      <div className="input-form">
        <label htmlFor={id}>{labelName}</label>
        <input
          type={inputType}
          id={id}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChangeHandler}
        />
      </div>
    </>
  );
};

export default InputForm;
