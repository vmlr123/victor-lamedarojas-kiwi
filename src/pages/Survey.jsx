import Form from "../features/Form";
import styles from "./Survey.module.css";

export default function Survey({ username }) {
  return (
    <div className={styles.surveyContainer}>
      <>
        <h1>Website Creation Survey</h1>
        <h4>Enter details to inquire about the creation of YOUR website</h4>
      </>
      <Form username={username} className={styles.form} />
    </div>
  );
}
