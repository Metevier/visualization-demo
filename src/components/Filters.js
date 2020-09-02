import React, { useState } from "react";
import { Select, Flex, Button } from "@chakra-ui/core";

const Filters = ({ fields, setFilter }) => {
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");

  const set = () => {
    setFilter({ field, operator, value });
  };

  return (
    <Flex justifyContent="center" m={5}>
      <Select
        onChange={(e) => setField(e.target.value)}
        value={field}
        placeholder="Select field"
        maxWidth="250px"
        mx={3}
      >
        {fields.map((field) => (
          <option key={field.name} value={field.name}>
            {field.name}
          </option>
        ))}
      </Select>
      <Select
        onChange={(e) => setOperator(e.target.value)}
        value={operator}
        maxWidth="250px"
        mx={3}
      >
        <option value="equals">Equals</option>
        <option value="notEquals">Not Equals</option>
      </Select>
      <Select
        onChange={(e) => setValue(e.target.value)}
        values={value}
        placeholder={field === "" ? "Select a field first" : "Select a value"}
        maxWidth="250px"
        mx={3}
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
      <Button minWidth="150px" mx={3} onClick={set} colorScheme="green">
        Apply
      </Button>
    </Flex>
  );
};

export default Filters;
