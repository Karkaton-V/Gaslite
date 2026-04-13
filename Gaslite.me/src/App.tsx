import { useState } from "react";
import Button from "./components/Button";
import Form from "./components/Form";

function App() {
  const [formVisible, setFormVisibility] = useState(false);

  return (
    <div>
      {formVisible && <Form onClose={() => setFormVisibility(false)}></Form>}
      {!formVisible && (
        <Button color="primary" onClick={() => setFormVisibility(true)}>
          Login
        </Button>
      )}
    </div>
  );
}

export default App;
