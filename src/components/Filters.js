import React, { useState } from "react";
import { Select, HStack, Button } from "@chakra-ui/core";

const Filters = ({ fields, setFilter }) => {
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");

  const set = () => {
    setFilter({ field, operator, value });
  };

  return (
    <HStack>
      <Select
        onChange={(e) => setField(e.target.value)}
        value={field}
        placeholder="Select field"
      >
        {fields.map((field) => (
          <option key={field.name} value={field.name}>
            {field.name}
          </option>
        ))}
      </Select>
      <Select onChange={(e) => setOperator(e.target.value)} value={operator}>
        <option value="equals">Equals</option>
        <option value="notEquals">Not Equals</option>
      </Select>
      <Select
        onChange={(e) => setValue(e.target.value)}
        values={value}
        placeholder={field === "" ? "Select a field first" : "Select a value"}
      >
        {field !== ""
          ? fields
              .find((f) => f.name === field)
              .allowedValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))
          : ""}
      </Select>
      <Button onClick={set}>Apply</Button>
    </HStack>
  );
};

export default Filters;
