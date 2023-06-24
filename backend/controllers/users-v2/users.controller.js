import { USERS } from "../../models/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../middlewares/index.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let found = await USERS.findOne({
      where: { email: email.trim(), is_deleted: false },
    });
    if (found) {
      const match = await bcrypt.compare(password, found.password);
      if (!match) {
        return res.status(401).json({ status: 401, data: null, message: "Invalid Password!" });
      }
      let token = await generateToken(found.id, found.role_id, req.body.ios);
      await found.update({ last_login: new Date() });
      let dataToSend = {
        id: found.id,
        first_name: found.first_name,
        last_name: found.last_name,
        email: found.email,
        full_name: found.full_name,
      };
      return res.status(200).json({
        status: 200,
        data: { userDetails: dataToSend, token },
        message: "Success",
      });
    } else {
      return res.status(404).json({ status: 404, data: null, message: "User Not Found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    let users = await USERS.update(
      {
        where: { token: req.token },
      },
      { token: null }
    );
    return res.status(200).json({
      status: 200,
      data: users,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  console.log(req.body);
  try {
    let found = await USERS.findOne({
      where: { email: email },
    });
    if (found) {
      return res.status(409).json({ status: 409, message: "User already exist!" });
    } else {
      let newUser = await USERS.create(
        {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          full_name: first_name.trim() + " " + last_name.trim(),
          email: email.trim(),
          password: password ? password.trim() : "temppass",
        },
        { isNewRecord: true }
      );

      return res.status(200).json({ status: 200, data: newUser, message: "Success" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.pageNumber) - 1 || 0,
    limit = parseInt(req.query.pageSize) || 50,
    orderBy = req.query.sortBy || "first_name",
    sortOrder = req.query.sortOrder || "ASC",
    skip = parseInt(page) * parseInt(limit);
  try {
    let objCondition = {
      is_deleted: false,
    };
    let allUsers = await USERS.findAll({
      where: objCondition,
      order: [[orderBy, sortOrder]],
      offset: skip,
      limit: limit,
      attributes: { exclude: ["password"] },
    });
    let count = await USERS.count({
      where: objCondition,
    });
    return res.status(200).json({ status: 200, data: { users: allUsers, count } });
  } catch (error) {
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

// Done
const getParticularUser = async (req, res) => {
  const { id } = req.params;
  try {
    let condition = { id: id };
    let user = await USERS.findOne({
      where: condition,
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json({ status: 200, data: user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

export { registerUser, loginUser, getAllUsers, getParticularUser, logoutUser };
