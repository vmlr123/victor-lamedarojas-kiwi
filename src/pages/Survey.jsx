import Form from "../features/Form";

export default function Survey({ username }) {
  return (
    <>
      <>
        <h1>Website Creation Survey</h1>
        <h4>Enter details to inquire about the creation of YOUR website</h4>
      </>
      <Form username={username} />
    </>
  );
}
