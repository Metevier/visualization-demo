import React from "react";
import { Button } from "@chakra-ui/core";

const FieldSelector = ({ fields, setField }) => {
  const set = (e) => setField(e.target.name);
  return (
    <>
      {fields.map((field) => {
        return (
          <Button onClick={set} name={field.name} key={field.name}>
            {field.name}
          </Button>
        );
      })}
    </>
  );
};

export default FieldSelector;
