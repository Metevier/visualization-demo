# https://elastic.unmentioned.io

## Project Description

This is a visualization demo that enables basic filtering and data breakdown for positive COVID-19 tests in July for the United States. This project was scaffolded using Create React App, and features no custom backend.

## Technical Decisions

### API

The data used for this project comes from the [CDC](https://data.cdc.gov/Case-Surveillance/COVID-19-Case-Surveillance-Public-Use-Data/vbim-akqf), and is a listing of postive COVID-19 tests. This API is powered by the [Socrata Open API](https://dev.socrata.com/). The API has its own custom syntax for requesting data, and while it does have an official Javascript client, I decided that building a partial client of my own would help showcase my skills outside of just React/Frontend. The client I built uses fluent syntax and currently enables selecting and renaming specific fields, and querying data using the "equals" and "not equals" operators. The filter creation is documented extensively via tests.

### Custom DataSources

I created a small helper to create a "DataSource" to power the filter API mentioned above, and to enable future custom data sources in the context of a real application. DataSources have fields, which are able to be named differently from the name of the field in the API. DataSources also specify `allowedValues`, which is an enumeration of all posible values for that field in the API.

### Data Visualization

There are many "React Chart" libraries available, but I decided to use a more primitive library so the project did not become me just wiring up a few libraries. The library is called (sx)[https://vx-demo.now.sh/] and offers both primitive charting components as well as complete charting solutions, all powered by d3.

### Data Aggregation

Data aggregation is done via a custom hook called `useAreaChart`. The data is aggregated based on date and the selected `areaField` to match the format required for the sx Area primitive. Aggregating is triggered when a change is made to the data or aggregation fields using `useEffect` internally. The chart computation is tested to ensure that data is aggregated correctly.

## Improvements if this were a real application

### Filtering/Aggregation on the Backend

While the current chart data is processed in a reasonable amount of time, for any significant amount of data we may begin to experience extreme delays or even crashes trying to process the chart data on the Frontend. Additionaly, sending all of the records over the network for each request uses a lot of bandwith, and could quickly become expensive. Processing on the Backend almost eliminates the bandwith issue, and can greatly speed up processing time, especially in a distributed solution.

### Testing React Components

This project currently does not test any React components. The secondary components (Filters, AreaSelection) could be tested in a straightforward way, but the Chart is more difficult. Depending on business importance, custom testing tools may be required to ensure no regression of charting features.
