// Require the dotenv package to hide the environment variables and import them elsewhere.
require('dotenv').config();
// Turn the openAI package into a class and import it along with the LangChain package.
const { OpenAI } = require("@langchain/openai");
// Instantiate the OpenAI class with the API key and temperature to control whether the model is more creative or more accurate (0 is more accurate, and 1 is more creative).
const model = new OpenAI({ 
    openAIApiKey: process.env.OPENAI_API_KEY, 
    temperature: 0,
    model: 'gpt-3.5-turbo'
});
// Test
console.log(model)
// Prompt function that takes an input and returns a response with try and catch blocks to handle errors for the model if it fails to invoke the models input.
const promptFunc = async (input) => {
    try {
      const res = await model.invoke(input);
      return res;
    }
    catch (err) {
      console.error(err);
      throw(err);
    }
  };
    
  // Test
  console.log(promptFunc("How do you capitalize all characters of a string in JavaScript?"));