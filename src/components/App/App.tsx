import { AddEvent } from "../AddEvent/AddEvent";
import * as styles from "./App.styles";
import { Login } from "../Login/Login";
import { EventsByDate } from "../EventsByDate/EventsByDate";

function App() {
  return (
    <div style={styles.appContainerTextAlign}>
      <Login />
      <AddEvent />
      <EventsByDate />
    </div>
  );
}

export default App;
