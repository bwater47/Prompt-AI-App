// Require the dotenv package to hide the environment variables and import them elsewhere.
require("dotenv").config();

// Turn the openAI package into a class and import it along with the LangChain package.
const { OpenAI } = require("@langchain/openai");

// Require the prompts from the LangChain package.
const { PromptTemplate } = require("@langchain/core/prompts");

// Require express for handling the server and body-parser for parsing JSON requests.
const express = require("express");
const bodyParser = require("body-parser");

// Instantiate the express app and set the port to 3001.
const app = express();
const port = 3001;

// Middleware to parse JSON requests.
app.use(bodyParser.json());

// Instantiate the OpenAI class with the API key and temperature to control whether the model is more creative or more accurate (0 is more accurate, and 1 is more creative).
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

// Instantiation of a new object called "prompt" using the "PromptTemplate" class
const prompt = new PromptTemplate({
  // This template will allow us to set the stage for the user's question and the response that the model will provide.
  template:
    "You are a programming expert and will answer the user's coding questions as thoroughly as possible using JavaScript. If the question is unrelated to coding, do not answer.\n{question}",
  // The inputVariables will allow us to inject user input directly into the template so that whatever question the user asks it will always be within the confines of the overall context set with the prompts template property.
  inputVariables: ["question"]
});

// Prompt function that takes an input and returns a response with try and catch blocks to handle errors for the model if it fails to invoke the models input.
const promptFunc = async (input) => {
  try {
    // Format the prompt with the user input.
    const promptInput = await prompt.format({
      question: input,
    });
    // Invoke the model with the formatted prompt.
    const res = await model.invoke(promptInput);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Endpoint to handle request.
app.post("/ask", async (req, res) => {
  // Try and catch block to handle errors for the model if it fails to invoke the models input.
  try {
    // Variable for the user's question.
    const userQuestion = req.body.question;
    // If the user does not provide a question, return an error message.
    if (!userQuestion) {
      return res
        .status(400)
        .json({ error: "Please provide a question in the request body." });
    }
    // Await the prompt function to get the result and log it to the console.
    const result = await promptFunc(userQuestion);
    console.log(result);
    res.json({ result });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
