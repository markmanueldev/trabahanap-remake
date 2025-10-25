import Employers from "../../models/employer_model.mjs";


export async function createEmployer(employerData) {
  try {
    const result = await Employers.create(employerData);
    return result;
  } catch (error) {
    logger.error(`Error creating employer: ${error.message}`);
    throw error;
  }
}
