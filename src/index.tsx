import { createClient, useQuery, Provider } from "urql";
import gql from "graphql-tag";
import React from "react";
import ReactDOM from "react-dom";

const query = gql(`
query MyQuery {
  requestDetails {
      id
  }
}
`);

const client = createClient({
  url: "http://localhost:4000/graphql"
});

function InnerComponent(props: { someUniqueValue: number }) {
  const [{ data }] = useQuery({
    query,
    variables: { key: props.someUniqueValue }
    // requestPolicy: 'network-only'
  });
  console.log(
    `[InnerComponent ${props.someUniqueValue}]`,
    data && data.requestDetails.id
  );
  return <p>{JSON.stringify(data)}</p>;
}

function WrapperComponent(props: { someUniqueValue: number }) {
  const [{ fetching }] = useQuery({
    query,
    variables: { key: props.someUniqueValue }
  });
  // Removing this check will make the React warnings go away.
  if (fetching) {
    return <p>loading</p>;
  }
  return (
    <>
      <InnerComponent someUniqueValue={props.someUniqueValue} />
    </>
  );
}

ReactDOM.render(
  <Provider value={client}>
    {/*There is no error with one children. The more you add, the higher the chance*/}
    {/*1 component: no warning*/}
    {/*2 components: sometimes it gives a warning*/}
    {/*3 components: random 1 to 3 warnings*/}
    <WrapperComponent someUniqueValue={1} />
    <WrapperComponent someUniqueValue={2} />
    <WrapperComponent someUniqueValue={3} />
  </Provider>,
  document.getElementById("root")
);
