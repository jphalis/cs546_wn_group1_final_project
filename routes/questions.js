import { Router } from 'express';
import { questionData } from "../data/index.js";
let router = Router()

router
  .route('/:questionId')
  .get(async (req, res) => {
    try {
      const question = await questionData.getQuestionById(req.params.questionId);
      const comments = await questionData.getCommentsByQuestionId(req.params.questionId);
      res.render('questions/question', {
        ...question,
          comments,
          isAuthenticated: req.session.user
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

    router
    .route('/:questionId/report')
    .get((req, res) => {
        console.log(`GET request for /questions/${req.params.questionId}/report`);
        res.render('reportPage', { questionId: req.params.questionId });
    })
    .post(async (req, res) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                return res.status(400).send({ success: false, error: "Missing questionId in URL." });
            }

            // Simulate reporting action
            const result = await questionData.report(questionId);

            console.log(`Report successful for questionId: ${questionId}`);
            res.redirect(`/questions/${questionId}/report`);
        } catch (e) {
            console.error("Error updating report:", e);
            res.status(500).send({ success: false, error: "Internal Server Error" });
        }
    });



export default router
