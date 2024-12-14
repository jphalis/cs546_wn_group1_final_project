import {
  comments,
  questions as questionCollection,
} from "../config/mongoCollections.js";
import { companiesData } from "../data/index.js";
import validations from "../validations.js";
import util from "./utilities.js";

const exportedMethods = {
  async createNewQuestion(
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
    let userQuestion = question;
    let userQuestionRole = role;
    let userQuestionDifficulty = difficulty;
    let userQuestionCompany = company;
    let userQuestionLocation = location;
    let userQuestionExperience = experience;
    let userQuestionType = type;
    let userQuestionCategory = category;

    let validQuestion = validations.checkUserQuestion(
      userQuestion,
      userQuestionRole,
      userQuestionDifficulty,
      userQuestionCompany,
      userQuestionLocation,
      userQuestionExperience,
      userQuestionType,
      userQuestionCategory
    );

    let dup_question = await this.doesQuestionExist(userQuestion);
   
    if (dup_question) {
      throw new Error("Question Already Exists");
    } else {
      let userAnswer = await validations.generateAnswer(
        userQuestion,
        userQuestionCompany
      );
  
      let createdTime = util.getCurrentDateTime();
      let updatedTime = util.getCurrentDateTime();

      userQuestionCompany = companiesData.showCompanyId(userQuestionCompany);

      const questionCollectionList = await questionCollection();
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
        questionSource: "User",
        type: userQuestionType,
        answer: userAnswer,
        answerSource: "Generated",
        category: userQuestionCategory,
        upvote: 0,
      };

      let insertResult = await questionCollectionList.insertOne(newQuestion);

      if (!insertResult.insertedId) {
        throw new Error("Could not create the question");
      }
      return { registrationCompleted: true };
    }
  },
  async getAllQuestions() {
    let questionCollectionList = await questionCollection();
    let allQuestions = await questionCollectionList.find({}).toArray();
    if (allQuestions.length === 0) {
      throw new Error("There are no question found in the database.");
    }
    return allQuestions;
  },

  async getCompanyQuestions(companyId) {
    try {
      let questionCollectionList = await questionCollection();
      let questions = await questionCollectionList
        .find({
          company_id: companyId,
        })
        .toArray();
      let questionIds = questions.map((question) => question._id);
      return questions;
    } catch (e) {
      throw new Error(e);
    }
  },

  async getQuestionById(id) {
    id = validations.checkId(id, "ID");
    let questionCollectionList = await questionCollection();
    let question = await questionCollectionList.findOne({
      _id: id,
    });
    if (!question) {
      throw new Error("Error: Question not found");
    }
    return question;
  },

  async removeQuestion(id) {
    id = validations.checkId(id, "ID");
    let questionCollectionList = await questionCollection();
    let deletedQuestion = await questionCollectionList.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletedQuestion) {
      throw new Error("Error: Question not found");
    }
    return { ...deletedQuestion, deleted: true };
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
      createdAt: new Date(),
    };

    const result = await commentsCollection.insertOne(newComment);

    return newComment.text;
  },

  async upvote(questionId) {
    const questions = await questionCollection();

    const filter = { _id: questionId };
    const update = { $inc: { upvote: 1 } };
    const options = { upsert: true };

    const result = await questions.updateOne(filter, update, options);

    return result;
  },
  async report(questionId) {
    const questions = await questionCollection();
  
    const filter = { _id: questionId };
  
    const update = {
      $inc: { reports: 1 }
    };
  
    const options = { upsert: false };
  
    const result = await questions.updateOne(filter, update, options);
  
    return result;
  },

  async doesQuestionExist(userQuestion) {
    let result = false;
    let questionCollectionList = await questionCollection();
    let allQuestions = await questionCollectionList
      .find({ question: userQuestion })
      .toArray();

    if (allQuestions.length >= 1) {
      result = true;
    }

    return result;
  },
};

export default exportedMethods;
