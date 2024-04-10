require("dotenv").config("src/.env");
const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
console.log(process.env.GEMINI_KEY);
app.post("/gemini", async (req, res) => {
  console.log(req.body);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;
  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});