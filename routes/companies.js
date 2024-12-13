import { Router } from 'express'
let router = Router()
import { companiesData, questionData } from '../data/index.js'
import validations from '../validations.js'

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const companiesList = await companiesData.getCompaniesByPage(1, 60)
      res.render('companies/companyList', { companies: companiesList })
    } catch (e) {
      return res.status(500).send(e)
    }
  })
  .post(async (req, res) => {
    let companyInfo = req.body

    if (!companyInfo || Object.keys(companyInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'You must provide data to create a company' })
    }
    try {
      const newCompany = await companiesData.createCompanies(
        companyInfo._id,
        companyInfo.name,
        companyInfo.domain,
        companyInfo.created_ts,
        companyInfo.updated_ts,
        companyInfo.description,
        companyInfo.size,
        companyInfo.location
      )
      res.status(201).json(newCompany)
    } catch (e) {
      res.status(500).json({ error: e })
    }
  })

router.route('/page/:page').get(async (req, res) => {
  let page

  try {
    page = parseInt(req.params.page, 10)
    if (isNaN(page) || page <= 0) {
      throw new Error('Page must be a positive integer.')
    }
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const companiesList = await companiesData.getCompaniesByPage(page, 60)
    res.status(200).json(companiesList)
  } catch (e) {
    return res.status(404).json({ error: e.message })
  }
})

router
  .route('/:companyId')
  .get(async (req, res) => {
    try {
      const company = await companiesData.getCompanyById(req.params.companyId)
      const companyQuestions = await questionData.getCompanyQuestions(
        req.params.companyId
      )

      const totalQuestions = companyQuestions.length;
      if (totalQuestions === 0) {
        company.overallDifficulty = "No questions available"
      } else {
        let difficultySum = 0;

        for (const question of companyQuestions) {
          if (question.difficulty === "Easy") difficultySum += 1;
          else if (question.difficulty === "Medium") difficultySum += 2;
          else if (question.difficulty === "Hard") difficultySum += 3;
        }

        const averageDifficulty = difficultySum / totalQuestions;

        const overallDifficulty = 2 * averageDifficulty - 1; //Convert to 5-point scale
        company.overallDifficulty = parseFloat(overallDifficulty.toFixed(1));
      }
      res.render('companies/company', {
        company: company,
        companyQuestions: companyQuestions
      })
    } catch (e) {
      return res.status(404).json(e)
    }
  })
  .put(async (req, res) => {
    let companyId = req.params.companyId
    let requestBody = req.body

    try {
      companyId = validations.checkId(companyId, 'Company ID')
      if (!requestBody || Object.keys(requestBody).length === 0) {
        throw new Error('You  ust provide data to update a company')
      }
      requestBody.name = validations.checkString(
        requestBody.name,
        "Company's name"
      )
      requestBody.description = validations.checkString(
        requestBody.description,
        "Company's description"
      )
      requestBody.size = validations.checkString(requestBody.size, 'Size')
      requestBody.location = validation.checkString(
        requestBody.location,
        'Location'
      )
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }

    try {
      const updatedCompany = await companiesData.updateCompany(
        companyId,
        requestBody.name,
        requestBody.description,
        requestBody.size,
        requestBody.location
      )
      res.status(200).json(updatedCompany)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  })
  .patch(async (req, res) => {
    let companyId = req.body.companyId
    let companyInfo = req.body

    if (!companyInfo || Object.keys(companyInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'You must provdie data to update a company' })
    }
    try {
      companyId = validations.checkId(companyId, 'Company ID')

      if (companyInfo.name) {
        companyInfo.name = validations.checkString(
          companyInfo.name,
          "Company's Name"
        )
      }
      if (companyInfo.description) {
        companyInfo.name = validations.checkString(
          companyInfo.description,
          'Description'
        )
      }
      if (companyInfo.size) {
        companyInfo.size = validations.checkString(companyInfo.size, 'Size')
      }
      if (companyInfo.location) {
        companyInfo.location = validations.checkString(
          companyInfo.location,
          'Location'
        )
      }
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }

    try {
      const updatedCompany = await companiesData.updateCompany(
        companyId,
        companyInfo.name,
        companyInfo.description,
        companyInfo.size,
        companyInfo.location
      )
      res.status(200).json(updatedCompany)
    } catch (e) {
      return res.status(404).send({ error: e })
    }
  })
  .delete(async (req, res) => {
    let companyId = req.params.companyId

    try {
      companyId = validations.checkId(companyId, 'Company ID')
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }

    try {
      let deletedCompany = await companiesData.removeCompany(companyId)
      res.status(200).json(deletedCompany)
    } catch (e) {
      return res.status(404).json({ error: e.message })
    }
  })

router.route('/companiessearch').post(async (req, res) => {
  try {
    const { searchByTitle } = req.body
    if (!searchByTitle || !searchByTitle.trim()) {
      res.status(400).render('error', { error: 'You must enter a search name' })
      return
    }
    const companies = await companiesData.getCompanyByTitle(
      searchByTitle.trim()
    )

    if (companies.length === 0) {
      res
        .status(404)
        .render('error', {
          error: `We're sorry, but no results were found for ${searchByTitle}`
        })
    } else {
      res.render('companies/searchResults', { companies, searchByTitle })
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
