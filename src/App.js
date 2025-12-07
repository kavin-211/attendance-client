import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{padding: "40px"}}>
      <h1>Simple MERN Stack App</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
