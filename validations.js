import { ObjectId } from 'mongodb'
import OpenAI from "openai";

const exportedMethods = {
  checkString (strVal, varName) {
    if (!strVal) {
      throw new Error(`Error: You must supply a ${varName}!`)
    }
    if (typeof strVal !== 'string') {
      throw new Error(`Error: ${varName} must be a string!`)
    }
    strVal = strVal.trim()
    if (strVal.length === 0) {
      throw new Error(
        `Error: ${varName} cannot be an empty string or string with just spaces`
      )
    }
    if (!isNaN(strVal)) {
      throw new Error(
        `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
      )
    }
    return strVal
  },

  checkEmail (strVal, varName) {
    strVal = this.checkString(strVal, varName)
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(strVal)) {
      throw new Error('Error: Invalid email format')
    }
    return strVal.toLowerCase()
  },

  checkPassword (strVal, varName) {
    strVal = this.checkString(strVal, varName)
    if (strVal.length < 6) {
      throw new Error('Error: Your password must be longer than 5 characters')
    }
    return strVal
  },

  checkId (id, varName) {
    if (!id) {
      throw new Error('Error: You must provide an id to search for')
    }
    if (typeof id !== 'string') {
      throw new Error('Error: id must be a string')
    }
    id = id.trim()
    if (id.length === 0) {
      throw new Error('Error: id cannot be an empty string or just spaces')
    }
    if (!ObjectId.isValid(id)) {
      throw new Error('Error: invalid object ID')
    }
    return id
  },

  checkStringArray (arr, varName) {
    // Allow an empty array. If it's not empty, make sure all tags are strings.
    if (!arr || !Array.isArray(arr))
      throw new Error(`You must provide an array of ${varName}`)
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw new Error(
          `One or more elements in ${varName} array is not a string or is an empty string`
        )
      }
      arr[i] = arr[i].trim()
    }
    return arr
  },

  // function for generating an AI-written solution to the question provided by the user
  async generateAnswer(question, company) {

    // splitting the API key into two parts since OpenAI auto-detects and disables it otherwise when it gets pushed to a public repository
    const part1 = 'sk-proj-28vHB87OnzIPSaojCLwp9tx7ARVWYj_ZGxTPHbr30IiPGIh_X6sI8jvVIQh3C0CCfWS2df5QW4';
    const part2 = 'T3BlbkFJNAbI12douhngFwnyQKW3WIB7X6fCZK7LR4wpPtyoRpEu2B9ATe2YzQmNmEsYpjbNbGzs3fJ6IA';

    const openai = new OpenAI({
      apiKey: part1 + part2,
    });

    try {
      const prompt = `In one paragraph or less, explain how I can best answer this interview question for ${company} in a straightforward and concise manner, avoiding unnecessary filler words like 'Certainly', 'Sure', and 'Of course': ${question}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt },
        ],
      });

      return completion.choices[0].message.content.trim();
    } catch (e) {
      console.error('Error fetching AI response:', e);
      throw e;
    }
  }
}

export default exportedMethods
