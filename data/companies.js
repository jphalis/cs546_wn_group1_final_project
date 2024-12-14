import { companies } from '../config/mongoCollections.js';
import validations from '../validations.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
  async createCompanies (id, name, domain, created_ts, updated_ts, description, size, location) {
    const newCompany = {
      _id: id.trim(),
      name: name.trim(),
      domain: domain.trim(),
      created_ts,
      updated_ts,
      description,
      size,
      location,
      questions: []
    }

    const companiesCollection = await companies();
    const insertInfo = await companiesCollection.insertOne(newCompany);

    if(!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add new company';

    return {...newCompany};
  },
  async getAllCompanies () {
    const companiesCollection = await companies();
    const companiesList = await companiesCollection.find({}).toArray();
    if (companiesList.length === 0) {
      throw new Error('There are no companies found in the database.')
    }
    return companiesList;
  },
  async getCompanyByTitle (title) {
    //validate input
    try {
      const companiesCollection = await companies();
      const company = await companiesCollection.find({name: { $regex: title, $options: 'i' }
      }).toArray();
      return company;
    }catch(e) {
      throw `Error: Error fetching company data: ${e}`;
    }
  },
  //This is for administrative users only
  async getCompanyById (id) {
    // id = validations.checkId(id, 'Company ID');

    // const companyId = new ObjectId(id);
    // console.log(companyId);
    const companiesCollection = await companies();
    const company = await companiesCollection.findOne({_id: id.trim()});

    if(!company) throw 'Error: No company found';
    return company;
  },
  //This is for administrative users
  async removeCompany (id) {
    id = validations.checkId(id);
    const companyId = new ObjectId(id);
    const companiesCollection = await companies();

    const companyToRemove = await companiesCollection.findOneAndDelete({_id: companyId});

    if(!companyToRemove.value) throw 'Error: No company found to remove';

    return `${companyToRemove.value.name} have been successfully deleted!`;
  },
  //For administrative users to update basic information
  async updateCompany (id, name, description, size, location) {


    const updateData = {};
    if (name) updateData.name =name;
    if (description) updateData.description = description;
    if (size) updateData.size = size;
    if (location) updateData.location = location;

    const companiesCollection = await companies();

    const companyId = new ObjectId(id);
    const updatedInfo = await companiesCollection.findOneAndUpdate(
      {_id: companyId},
      {$set: updateData},
      {returnDocument: 'after'}
    );

    if (!updatedInfo) throw new Error (`Update failed, could not find company with id of ${id}`)
  },
  async showCompanyId (name) {
    try {
      const companiesCollection =  await companies();
      const companiesList = await companiesCollection.find({}).toArray();

      for (const company of companiesList) {
        if (company.name.toLowerCase() === name.toLowerCase()) {
          return company._id;
        }
      }
    } catch(e) {
      throw new Error (`Error: Company with name ${name} not found.`)
    }

  },
  async getCompaniesByPage(page, limit) {
    if (!Number.isInteger(page) || page <= 0) {
      throw new Error('Page must be a positive integer.');
    }
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('Limit must be a positive integer.');
    }

    const skip = (page - 1) * limit;

    const companiesCollection = await companies();
    const companiesList = await companiesCollection.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    if (companiesList.length === 0) {
      throw new Error('No companies found on this page.');
    }

    return companiesList;
  }
//   async updateQuestions () {

//   }
}
export default exportedMethods;
