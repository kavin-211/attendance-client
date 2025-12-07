import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://attendance-server-8gjy.onrender.com/api/message")
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
