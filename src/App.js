import React from "react";
import { useState, useRef } from "react";
import { UserIcon } from "@heroicons/react/20/solid";
function App() {
  const askButtonRef = useRef(null);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const supriseOptions = [
    "What is the meaning of life?",
    "How many stars are there in the univers?",
    "What is gravity?",
  ];

  const surprise = () => {
    const random = Math.floor(Math.random() * supriseOptions.length);
    setValue(supriseOptions[random]);
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      askButtonRef.current.click();
    }
  };

  const prompt = async () => {
    if (value === "") {
      setError("Maybe you should ask something first :)");
      setTimeout(() => {
        setError("");
      }, 1400);
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);

      setValue("");
    } catch (error) {
      console.log(error.message);
      setError("Something went wrong");
    }
  };
  return (
    <div className="wrapper">
      <p>
        What's on your mind?
        {chatHistory.length === 0 && (
          <button className="surprise" onClick={surprise}>
            surprise me
          </button>
        )}
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Ask me anything ..."
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onEnter}
        />
        {!error && (
          <button ref={askButtonRef} onClick={prompt}>
            Ask me
          </button>
        )}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="search-result">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p className="answer">
              {chat.role === "user" && <UserIcon className="user-icon" />}
              {chat.parts[0].text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
