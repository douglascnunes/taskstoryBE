const sequelize = require('../util/db.js');

const errorHelper = require('../util/error.js');

const expValidatorRes = require('express-validator').validationResult;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user/user.js');
const UserLevel = require('../models/user/userLevel.js');




exports.signup = async (req, res, next) => {
  console.log('ACONTECEU')
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed.', 422, errors));
  }

  const name = req.body.name;
  const email = req.body.email;
  const birthdate = req.body.birthdate;
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  try {
    const userLevel1 = await UserLevel.findOne({where: {level: 1}});

    const user = await User.create({
      name: name,
      email: email,
      dateBirth: birthdate,  // Mudar o model User de dateBirth para birthdate
      password: hashedPassword,
      userLevelId: userLevel1.id,
    })

    console.log(`User ${user.name} (id:${user.id}) created account.`) // CONSOLE
    res.status(201).json({
      message: 'User created successfully!', 
      userId: user.id 
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}



exports.login = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed.', 422, errors));
  }

  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    loadedUser = await User.findOne({where: {email: email}});
    if (!loadedUser) { 
      throw errorHelper.controllerErrorObj('User with email not found.', 401, errors);
    }
    // const doMatch = await bcrypt.compare(password, loadedUser.password);
    // if (!doMatch) { 
    //   throw errorHelper.controllerErrorObj('Invalid password.', 401, errors); 
    // }
    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser.id.toString()
    }, process.env.JWT_SECRET,
      // { expireIn: '1h'}
    );
    console.log(`User ${loadedUser.name} (id:${loadedUser.id}) logged in.`) // CONSOLE
    res.status(200).json({
      token:token, 
      userId: loadedUser.id.toString()}
    );
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
