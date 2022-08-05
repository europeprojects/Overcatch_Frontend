import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";

function LetterTypeSelector({
                              name,
                              value,
                              handleChange,
                              selectList,
                              disabled,
                              fullWidth,
                              size,
                            }) {
  return (
    <FormControl fullWidth={fullWidth || false} size={size || "medium"}>
      <Select
        name={name}
        value={value}
        onChange={handleChange}
        variant="outlined"
        disabled={disabled || false}
      >
        {selectList.map((item, i) => (
          <MenuItem key={i} value={item.letterTypeName}>
            {item.letterTypeName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LetterTypeSelector;
