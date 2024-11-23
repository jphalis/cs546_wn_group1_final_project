import { questions as questionCollection } from '../config/mongoCollections.js'
import { users as usersCollection } from '../config/mongoCollections.js'
import * as util from './utilities.js'
const exportedMethods = {

    async createQuestion (
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
        
        
        let userQuestion = validations.checkString(question, 'User Question');
        let userQuestionRole = validations.checkString(role, 'Role Question');
        let userQuestionDifficulty = validations.checkString(difficulty, 'Difficulty Question');
        let userQuestionCompany = validations.checkString(company, 'Company Question');
        let userQuestionLocation = validations.checkString(location, "Location Question")
        let userQuestionExperience = validations.checkString(experience, 'Experience Question');
        let userQuestionType = validations.checkString(type, 'Type Question');
        let userQuestionCategory = validations.checkString(category, 'Category Question');
        answer = validations.checkString(answer, "Answer");
    

        //fill in other fields for db doc
        let createdTime = util.getCurrentDateTime(); 
        let updatedTime = util.getCurrentDateTime();

        userQuestionCompany = getCompanyId(userQuestionCompany);

        let questionCollection = await questionCollection()
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
            answer: answer,
            answerSource: "Generated",
            category: userQuestionCategory,
            
        }


        let insertResult = await questionCollection.insertOne(newQuestion);


        if (!insertResult.insertedId) {
          throw new Error('Error: Could not create the user')
        }
        return { _id: insertResult.insertedId.toString(), ...newQuestion }
    }




}



export default exportedMethods
