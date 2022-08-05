import NumberFormat from 'react-number-format';
import React from "react";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export function TcknAndVknComponent(props: NumberFormatCustomProps) {
  const {inputRef, onChange, ...other} = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isAllowed={(values) => {
        let sayi = props.name === 'TCKN' ? 11 : 10;
        return values.value.length <= sayi;
      }}
      isNumericString
    />
  );
}
