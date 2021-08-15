/* eslint-disable no-underscore-dangle */
import Prescription from "../models/Prescription";
import logger from "../logger";
import User from "../models/User";

export const prescriptrionService = {

  async createNewPrescription(data) {
    try {

      const userFullName = data.prescriptionFor.split(' ');

      const user = await User.findOne(({ $and: [{ lastName: userFullName[0] }, { firstName: userFullName[1] }] }));
      const provider = await User.findOne({ "email": data.prescriptionFrom });


      const prescriptionData = await new Prescription({
        prescriptionFor: user._id,
        prescriptionVaccine: data.prescriptionVaccine,
        prescriptionDosage: data.prescriptionDosage,
        prescriptionFrom: provider._id
      });
      const prescriptionResponse = await prescriptionData.save();
      return { status: 201, prescriptionResponse };
    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong.' };
    }
  },

  async getPrescriptionsByUser(userEmail) {
    try {
      const pres = await Prescription.find({ prescriptionFor: userEmail });
      return { status: 200, pres };
    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong.' };
    }
  }
}