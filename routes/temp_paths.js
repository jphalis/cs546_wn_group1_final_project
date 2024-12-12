import { Router } from "express";
let router = Router();
import { usersData } from "../data/index.js";
import { questionData } from "../data/index.js";
import validations from "../validations.js";

router.route("/").get((req, res) => {
  try {
    res.render("users/createQuestion");
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.route("/submit").post(async (req, res) => {
  let userQuestion = validations.checkString(
    req.body.user_question_input,
    "User Question"
  );
  let userQuestionRole = validations.checkString(
    req.body.user_question_role,
    "Role Question"
  );
  let userQuestionDifficulty = validations.checkString(
    req.body.user_question_diff,
    "Difficulty Question"
  );
  let userQuestionCompany = validations.checkString(
    req.body.user_question_company,
    "Company Question"
  );
  let userQuestionLocation = validations.checkString(
    req.body.user_question_location,
    "Location Question"
  );
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
});

router
  .route("/interviewQ")
  .get((req, res) => {
    try {
      res.render("users/liveMock");
    } catch (e) {
      return res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    const { firstName, LastName, email, interviewType, date, time } = req.body;

    if (
      (!firstName || Object.keys(firstName).length === 0) &&
      (!LastName || Object.keys(LastName).length === 0) &&
      (!email || Object.keys(email).length === 0) &&
      (!interviewType || Object.keys(interviewType).length === 0) &&
      (!date || Object.keys(date).length === 0) &&
      (!time || Object.keys(time).length === 0)
    ) {
      return res.status(400).json({ error: "There are no fields in the request body" });
    }

    //search for user

    try {
      let user = await usersData.getUserByEmail(email);

      let newMockInterview = {
        firstName: firstName,
        LastName: LastName,
        email: email,
        interviewType: interviewType,
        date: date,
        time: time,
      };

      if (!user.newMockInterviews) {
        user.newMockInterviews = [];
      }

      user.newMockInterviews.push(newMockInterview);

      let update = await usersData.updateUserPatch(user._id.toString(), user);
      if (!update) {
        res.status(400).json({ error: "User Update Fail" });
      }
      res.status(201).json(true);
    } catch (e) {
      return res.status(404).json(e);
    }
    //either add field and update
  });

router.route("/thankYouSubmission").get((req, res) => {
  try {
    res.render("generic/submissionThankYou");
  } catch (e) {
    return res.status(500).send(e);
  }
});
export default router;
