import { createDataSource, fieldTypes } from "./dataSource";
const dataSource = createDataSource({
  reportDate: fieldTypes.timestamp({ fieldName: "cdc_report_dt" }),
  currentStatus: fieldTypes.text({
    fieldName: "current_status",
    allowedValues: ["Laboratory-confirmed case", "Probable Case"],
  }),
  sex: fieldTypes.text({
    allowedValues: ["Male", "Female", "Unknown", "Other"],
  }),
  age: fieldTypes.text({
    fieldName: "age_group",
    allowedValues: [
      "0 - 9 Years",
      "10 - 19 Years",
      "20 - 39 Years",
      "40 - 49 Years",
      "50 - 59 Years",
      "60 - 69 Years",
      "70 - 79 Years",
      "80+ Years",
    ],
  }),
  raceAndEthnicity: fieldTypes.text({
    fieldName: "race_ethnicity_combined",
    allowedValues: [
      "Hispanic/Latino",
      "American Indian / Alaska Native, Non-Hispanic",
      "Asian, Non-Hispanic",
      "Black, Non-Hispanic",
      "Native Hawaiian / Other Pacific Islander, Non-Hispanic",
      "White, Non-Hispanic",
      "Multiple/Other, Non-Hispanic",
    ],
    currentStatus: fieldTypes.text({
      fieldName: "current_status",
      allowedValues: ["Laboratory-confirmed case", "Probable Case"],
    }),
    hospitalized: fieldTypes.text({
      fieldName: "hosp_yn",
      allowedValues: ["Yes", "No", "Missing", "Unknown"],
    }),
    icu: fieldTypes.text({
      fieldName: "icu_yn",
      allowedValues: ["Yes", "No", "Missing", "Unknown"],
    }),
    death: fieldTypes.text({
      fieldName: "death_yn",
      allowedValues: ["Yes", "No", "Missing", "Unknown"],
    }),
    additionalConditions: fieldTypes.text({
      fieldName: "medcond_yn",
      allowedValues: ["Yes", "No", "Missing", "Unknown"],
    }),
  }),
});

export default dataSource;
