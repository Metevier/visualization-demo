import React from "react";
import { Button, Flex } from "@chakra-ui/core";

const FieldSelector = ({ fields, setField, selectedField }) => {
  const set = (e) => setField(e.target.name);
  return (
    <Flex justifyContent="stretch" my={2}>
      {fields.map((field) => {
        return (
          <Button
            flexGrow={1}
            mx={2}
            p={5}
            onClick={set}
            name={field.name}
            key={field.name}
            colorScheme={field.name === selectedField ? "blue" : "gray"}
          >
            {field.name}
          </Button>
        );
      })}
    </Flex>
  );
};

export default FieldSelector;
