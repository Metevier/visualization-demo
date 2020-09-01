import { useQuery } from "react-query";

const fetchData = async (key, params) => {
  const req = await fetch(
    `https://data.cdc.gov/resource/vbim-akqf.json?$limit=40000000&${params.join(
      "&"
    )}`
  );
  return await req.json();
};

const useDataSource = (filter) => {
  return useQuery(["vbim-akqf.json", filter.getParams()], fetchData, {
    staleTime: 10000,
  });
};

const createOperation = (operator, clause) => (value) => {
  clause.set(value, operator);
  return clause.clauses();
};

const operators = (clause) => {
  return {
    equals: createOperation("=", clause),
    notEquals: createOperation("!=", clause),
  };
};

const whereGroup = function (fields) {
  const clauseBuilders = [];
  const separator = " AND ";

  return {
    build() {
      const query = clauseBuilders.map((x) => x()).join(separator);
      return clauseBuilders.length > 0 ? `$WHERE=(${query})` : "";
    },
    actions: {
      where(selector) {
        const field =
          typeof selector === "function"
            ? selector(fields)?.fieldName
            : fields[selector]?.fieldName;
        let value = null;
        let operator = null;

        const self = this;
        const clause = {
          clauses() {
            return self;
          },
          set(val, op) {
            value = val;
            operator = op;
          },
        };

        const build = () => {
          return `${field}${operator}'${value}'`;
        };
        clauseBuilders.push(build);

        return operators(clause);
      },
    },
  };
};

const selectGroup = function (fields) {
  const selectedFields = [];
  const separator = ",";

  const buildQuery = () => {
    const queryFields =
      selectedFields.length === 0
        ? Object.values(fields).map(
            (field) => `${field.fieldName} AS ${field.name}`
          )
        : selectedFields;

    return queryFields.join(separator);
  };

  return {
    build() {
      const query = buildQuery();
      return `$SELECT=${query}`;
    },
    actions: {
      select(...selectors) {
        const currentFields = selectors.map((selector) => {
          const field =
            typeof selector === "function"
              ? selector(fields)
              : fields[selector];

          return `${field?.fieldName} AS ${field?.name}`;
        });

        selectedFields.push(...currentFields);

        return this;
      },
    },
  };
};

const clauses = function (fields, groupBuilders) {
  const groups = groupBuilders.map((group) => group(fields));
  const actions = groups.reduce((acc, group) => {
    return { ...acc, ...group.actions };
  }, {});

  return {
    ...actions,
    build() {
      return groups
        .map((group) => group.build())
        .filter((group) => group !== "");
    },
  };
};

const withFilter = (dataSource, fluentBuilder) => {
  const clauseBuilder = clauses(dataSource, [whereGroup, selectGroup]);
  fluentBuilder && fluentBuilder(clauseBuilder);

  return {
    getParams: clauseBuilder.build,
  };
};

export { withFilter };
export default useDataSource;
