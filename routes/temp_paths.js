import { Router } from 'express'
let router = Router()

import { questionData } from '../data/index.js'
import validations from '../validations.js'


  router
  .route('/')
  .get((req, res) => {
    try {
      
      res.render('users/createQuestion')
    } catch (e) {
      return res.status(500).send(e)
    }
  })


  router
  .route('/submit')
  .post(async (req, res) => {
    console.log("POSTT");
    console.log(req.body);


    let userQuestion = validations.checkString(req.body.user_question_input, 'User Question');
    let userQuestionRole = validations.checkString(req.body.user_question_role, 'Role Question');
    let userQuestionDifficulty = validations.checkString(req.body.user_question_diff, 'Difficulty Question');
    let userQuestionCompany = validations.checkString(req.body.user_question_company, 'Company Question');
    let userQuestionLocation = validations.checkString(req.body.user_question_location, 'Location Question');
    let userQuestionExperience = req.body.user_question_experience;
    let userQuestionType = req.body.user_question_type;
    let userQuestionCategory = req.body.user_question_category;

    //call AI gen for answer (@jtshu)
    let aiAnswer = "";
          
    //after complete save it to DB 
    let newQuestion = await questionData.createNewQuestion(
      userQuestion,
      aiAnswer,
      userQuestionRole,
      userQuestionDifficulty,
      userQuestionCompany,
      userQuestionLocation,
      userQuestionExperience,
      userQuestionType,
      userQuestionCategory
    );

    console.log(newQuestion);
  
    console.log("END");
  
  })
  

  router
  .route('/interviewQ')
  .get((req, res) => {
    try {
      res.render('users/liveMock')
    } catch (e) {
      return res.status(500).send(e)
    }
  })
  .post(async (req, res) => {
    
    console.log("INSIDE ROUTE POST");
    let userInfo = req.body;
    console.log(userInfo);
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' })
    }
    
  })
export default router
