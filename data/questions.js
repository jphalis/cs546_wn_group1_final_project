import {comments, questions as questionCollection} from '../config/mongoCollections.js'
import * as companies from "../data/companies.js";
import util from './utilities.js'
import validations from '../validations.js'
import questions from "../routes/questions.js";

const exportedMethods = {
  async createNewQuestion (
    question,
    answer,
    role,
    difficulty,
    company,
    location,
    experience,
    type,
    category
  ) {
    console.log('CREATING QUESTION')
    let userQuestion = question
    let userQuestionRole = role
    let userQuestionDifficulty = difficulty
    let userQuestionCompany = company
    let userQuestionLocation = location
    let userQuestionExperience = experience
    let userQuestionType = type
    let userQuestionCategory = category
    let userAnswer = validations.generateAnswer(userQuestion, userQuestionCompany);
    

    //fill in other fields for db doc
    let createdTime = util.getCurrentDateTime()
    let updatedTime = util.getCurrentDateTime()

    // get companyID from company data file(@Fred1110)
    userQuestionCompany = companies.showCompanyId(userQuestionCompany);
    
    const questionCollectionList = await questionCollection()
    let newQuestion = {
      created_ts: createdTime,
      updated_at: updatedTime,
      question: userQuestion,
      role: userQuestionRole,
      difficulty: userQuestionDifficulty,
      reports: 0,
      company_id: userQuestionCompany,
      location: userQuestionLocation,
      experience: userQuestionExperience,
      questionSource: 'User',
      type: userQuestionType,
      answer: userAnswer,
      answerSource: 'Generated',
      category: userQuestionCategory
    }

    let insertResult = await questionCollectionList.insertOne(newQuestion)
    console.log(insertResult)
    console.log('AFTER RES')
    //display to user

    if (!insertResult.insertedId) {
      throw new Error('Error: Could not create the question')
    }
    return { registrationCompleted: true };
  },
  async getAllQuestions () {
    let questionCollectionList = await questionCollection()
    let allQuestions = await questionCollectionList.find({}).toArray()
    if (allQuestions.length === 0) {
      throw new Error('There are no question found in the database.')
    }
    return allQuestions
  },

  async getCompanyQuestions (companyId) {
    try {
      // companyId = validations.checkId(companyId, 'Company ID')
      let questionCollectionList = await questionCollection()
      let questions = await questionCollectionList
        .find({
          company_id: companyId
        })
        .toArray()
      let questionIds = questions.map(question => question._id)
      return questions
    } catch (e) {
      throw new Error(e)
    }
  },

  async getQuestionById (id) {
    // id = validations.checkId(id, 'ID')
    let questionCollectionList = await questionCollection()
    let question = await questionCollectionList.findOne({
      _id: id
    })
    if (!question) {
      throw new Error('Error: Question not found')
    }
    return question
  },

  async removeQuestion (id) {
    id = validations.checkId(id, 'ID')
    let questionCollectionList = await questionCollection()
    let deletedQuestion = await questionCollectionList.findOneAndDelete({
      _id: new ObjectId(id)
    })

    if (!deletedQuestion) {
      throw new Error('Error: Question not found')
    }
    return { ...deletedQuestion, deleted: true }
  },

  async getCommentsByQuestionId(questionId) {
    const commentsCollection = await comments();

    return commentsCollection.find({ questionId: questionId }).toArray();
  },

  async addComment(questionId, text) {
    const commentsCollection = await comments();
    const newComment = {
      questionId: questionId,
      text,
      createdAt: new Date()
    };

    const result = await commentsCollection.insertOne(newComment);

    return newComment.text;
  },

  async upvote(questionId){
    const questions = await questionCollection();

    const filter = { _id: questionId };
    const update = { $inc: { upvote: 1 } };
    const options = { upsert: true };

    const result = await questions.updateOne(filter, update, options);

    return result;
  }
}

export default exportedMethods
