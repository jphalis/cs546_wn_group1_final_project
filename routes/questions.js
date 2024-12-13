import { Router } from 'express'
let router = Router()
import {questionData} from "../data/index.js";

router
  .route('/:questionId')
  .get(async (req, res) => {
    try {
      const question = await questionData.getQuestionById(req.params.questionId);
      const comments = await questionData.getCommentsByQuestionId(req.params.questionId);
      res.render('questions/question', {
        ...question,
          comments
      });
    } catch (e) {
      return res.status(404).json(e);
    }
  });

router
    .route('/:questionId/comments')
    .post(async (req, res) => {
        try {
            const { text } = req.body;
            const newComment = await questionData.addComment(req.params.questionId, text);
            res.redirect(`/questions/${req.params.questionId}`);
        } catch (e) {
            console.error('Error:', e);
            return res.status(400).json(e);
        }
    });

router
    .route('/:questionId/upvote')
    .post(async (req, res) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                return res.status(400).send({ success: false, error: "Missing questionId in URL." });
            }

            const result = await questionData.upvote(questionId);

            res.status(200).send({
                success: true,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            });
        } catch (e) {
            console.error("Error updating upvote:", e);
            res.status(500).send({ success: false, error: "Internal Server Error" });
        }
    });

export default router
