import { Router } from "express";
let router = Router();
import bcrypt from "bcrypt";
import { usersData } from "../data/index.js";
import { questionData } from "../data/index.js";
import validations from "../validations.js";

router.route("/createQuestion")
.get((req, res) => {
  try {
    res.render("users/createQuestion");
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.route("/submit").post(async (req, res) => {
  try {
    let validQuestion = validations.checkUserQuestion(req.body.user_question_input,
      req.body.user_question_role,
      req.body.user_question_diff,
      req.body.user_question_company,
      req.body.user_question_location,
      req.body.user_question_experience,
      req.body.user_question_type,
      req.body.user_question_category
    );

    if(validQuestion)
    {
      let aiAnswer = "";

      let newQuestion = await questionData.createNewQuestion(
        req.body.user_question_input,
        aiAnswer,
        req.body.user_question_role,
        req.body.user_question_diff,
        req.body.user_question_company,
        req.body.user_question_location,
        req.body.user_question_experience,
        req.body.user_question_type,
        req.body.user_question_category
      );
    
      if (newQuestion.registrationCompleted) {
        try {
          res.redirect("/users/thankYouSubmission");
        } catch (e) {
          res.status(500).json({ error: e });
        }
      } else {
        
        try {
          res.render("error", { message: "Adding New Question Failed"});
        } catch (e) {
          res.status(500).json({ error: e });
        }
          
      }
    }

  
  } catch (error) {
    res.status(400).render('generic/error', {message: error});
  }
});

router
  .route("/interviewQuestion")
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
      return res
        .status(400)
        .render('generic/error',{ message: "There are no fields in the request body" });
    }

    try {
      

      let validInputs = validations.checkMockInterview(firstName,LastName,email,interviewType,date,time);
    
      if(!validInputs)
      {
       
        res.status(404).render('generic/error',{ message: "Invalid Inputs" });
      }

      let user = await usersData.getUserByEmail(email);

      if(!user)
      {
        res.status(404).render('generic/error',{ message: "User Not Found, Email Not Valid" });
      }

      let mockInterview = {
        firstName: firstName,
        LastName: LastName,
        email: email,
        interviewType: interviewType,
        date: date,
        time: time,
      };

      if (!user.mockInterviews) {
        user.mockInterviews = [];
      }

      user.mockInterviews.push(mockInterview);

      let update = await usersData.updateUserPatch(user._id.toString(), user);
      if (!update) {
        res.status(400).render('generic/error',{ message: "User Update Fail" });
      }
      res.status(201).json(true);
    } catch (e) {
      return res.status(404).render('generic/error',{ message: e });
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

router
  .route("/")
  .get(async (req, res) => {
    try {
      const userList = await usersData.getAllUsers();
      res.render("users/index", { users: userList });
    } catch (e) {
      return res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      userInfo.firstName = validations.checkString(
        userInfo.firstName,
        "First Name"
      );
      userInfo.lastName = validations.checkString(
        userInfo.lastName,
        "Last Name"
      );
      userInfo.email = validations.checkEmail(userInfo.email, "Email");
      userInfo.password = validations.checkPassword(
        userInfo.password,
        "Password"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const newUser = await usersData.createUser(
        userInfo.firstName,
        userInfo.lastName,
        userInfo.email,
        userInfo.password,
        userInfo.phoneNumber,
        userInfo.bio
      );
      return res.json(newUser);
    } catch (e) {
      return res.sendStatus(500);
    }
  })
  .delete(async (req, res) => {
    // Not implemented
    return res.send("DELETE request to http://localhost:3000/users");
  })
  .put(async (req, res) => {
    // Not implemented
    return res.send("PUT request to http://localhost:3000/users");
  });




router
  .route("/:userId")
  .get(async (req, res) => {
    try {
      req.params.id = validations.checkId(req.params.userId, "User ID");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const user = await usersData.getUserById(req.params.id);
      res.render("users/detail", {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
      });
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .put(async (req, res) => {
    let requestBody = req.body;
    let userId = validations.checkId(req.params.userId, "User ID");

    if (!requestBody || Object.keys(requestBody).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      requestBody.firstName = validations.checkString(
        requestBody.firstName,
        "First Name"
      );
      requestBody.lastName = validations.checkString(
        requestBody.lastName,
        "Last Name"
      );
      requestBody.email = validations.checkEmail(requestBody.email, "Email");
      requestBody.password = validations.checkPassword(
        requestBody.password,
        "Password"
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      let updatedUser = await usersData.updateUserPut(
        userId,
        requestBody.firstName,
        requestBody.lastName,
        requestBody.email,
        requestBody.password,
        requestBody.phoneNumber,
        requestBody.bio
      );
      res.status(200).json(updatedUser);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })
  .patch(async (req, res) => {
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.id = validations.checkId(req.params.id);
      if (userInfo.firstName) {
        userInfo.firstName = validations.checkString(
          userInfo.firstName,
          "First Name"
        );
      }
      if (userInfo.lastName) {
        userInfo.lastName = validations.checkString(
          userInfo.lastName,
          "Last Name"
        );
      }
      if (userInfo.email) {
        userInfo.email = validations.checkEmail(userInfo.email, "Email");
      }
      if (userInfo.password) {
        userInfo.password = validations.checkPassword(
          userInfo.password,
          "Password"
        );
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const updatedUser = await usersData.updateUserPatch(
        req.params.id,
        userInfo
      );
      return res.json(updatedUser);
    } catch (e) {
      return res.status(404).send({ error: e });
    }
  })
  .delete(async (req, res) => {
    let userId = req.params.userId;

    try {
      userId = validations.checkId(userId, "User ID");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      let deletedUser = await usersData.removeUser(userId);
      res.status(200).json(deletedUser);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

router
  .route("/:userId/edit")
  .get(async (req, res) => {
    try {
      req.params.userId = validations.checkId(req.params.userId, "User ID");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const user = await usersData.getUserById(req.params.userId);
      res.render("users/edit", { user: user });
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    let userInfo = req.body;
    let errors = [];

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      userInfo.userId = validations.checkId(userInfo.userId);
    } catch (e) {
      errors.push(e);
    }

    try {
      if (userInfo.firstName) {
        userInfo.firstName = validations.checkString(
          userInfo.firstName,
          "First Name"
        );
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      if (userInfo.lastName) {
        userInfo.lastName = validations.checkString(
          userInfo.lastName,
          "Last Name"
        );
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      if (userInfo.email) {
        userInfo.email = validations.checkEmail(userInfo.email, "Email");
      }
    } catch (e) {
      errors.push(e);
    }

    const user = await usersData.getUserById(userInfo.userId);

    try {
      if (userInfo.password) {
        let isOriginalPasswordMatch = false;
        try {
          isOriginalPasswordMatch = await bcrypt.compare(
            userInfo.password,
            user.password
          );
        } catch (e) {
          errors.push(e);
        }
        if (isOriginalPasswordMatch) {
          if (userInfo.newPassword) {
            userInfo.newPassword = validations.checkPassword(
              userInfo.newPassword,
              "New PasswordPassword"
            );
          }
        } else {
          errors.push("Your original password did not match our database");
        }
      }
    } catch (e) {
      errors.push(e);
    }

    if (errors.length > 0) {
      res.render("users/edit", {
        errors: errors,
        hasErrors: true,
        user: user,
      });
      return;
    }

    try {
      const updatedUser = await usersData.updateUserPatch(
        userInfo.userId,
        userInfo
      );
      res.redirect(`/users/${updatedUser._id}`);
    } catch (e) {
      return res.status(404).send({ error: e });
    }
  });

export default router;
