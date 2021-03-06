
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import logger from '../logger';
import User from '../models/User';
import { validateLoginData, validateUserData } from '../utils';
import Service from "../models/Service";
import throwError from "../common/throwError";
import { generateToken } from "../common/createToken";

export const userService = {
  async loginUser(data) {

    const { error } = validateLoginData(data);
    if (error) throwError(400, error.details[0].message)
    const user = await User.findOne({ email: data.email });
    if (!user) throwError(400, 'Nem létezik ilyen felhasználó.');

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) throwError(400, 'E-mail, vagy jelszó hibás.');

    const token = generateToken(user.email, user.role);

    return {
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token
    };

  },

  async createUser(data) {
    try {
      const { error } = validateUserData(data);
      if (error) {
        return { status: 400, error: error.details[0].message };
      }

      const emailExist = await User.findOne({ email: data.email }).exec();
      if (emailExist) {
        return { status: 400, error: 'E-mail cím már létezik!' };
      }

      const usersCount = await User.count();


      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const user = await new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: usersCount ? 'user' : 'admin'
      });
      await user.save();

      return {
        status: 201,
        message: 'User created'
      };

    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong' };
    }
  },

  async getUsers() {
    try {
      const users = await User.find().populate('providerTitle');
      const services = await Service.find();
      return {
        status: 200,
        users,
        services
      }

    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong' };
    }
  },

  async getUsersByService(serviceName) {
    const servicesArray = await Service.find();
    let serviceId;
    servicesArray.forEach(service => {
      if (serviceName === service.serviceName) serviceId = service._id;
    });
    try {
      const providers = await User.find({ "providerTitle": serviceId });
      return { status: 200, providers }
    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong' };
    }
  },

  async getUserById(id) {
    try {
      const singleUser = await User.findById(id).populate('providerTitle');
      return { status: 200, singleUser };
    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong' };
    }
  },

  async updateUser(data) {
    try {
      const serviceId = mongoose.Types.ObjectId(data.updateData.providerTitle);

      const responseUser = await User.findByIdAndUpdate(data.id,
        {
          firstName: data.updateData.firstName,
          lastName: data.updateData.lastName,
          role: data.updateData.role,
          providerTitle: serviceId

        }, { new: true }
      );

      if (!(responseUser.providerTitle === serviceId) && (data.updateData.providerTitle)) {
        const userId = mongoose.Types.ObjectId(data.id);

        await Service.findByIdAndUpdate(data.updateData.providerTitle,
          { $push: { "providers": userId } },
          { safe: true, upsert: true, new: true }
        );
      }

      return { status: 200, message: 'Sikeres frissítés' };
    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong' };
    }
  },

  async deleteUser(id) {
    try {
      await User.findByIdAndRemove(id);
      return { status: 202, message: 'Sikeres törlés' };
    } catch (err) {
      logger.error(err);
      return { status: 500, error: 'Something went wrong' };
    }
  }
}
