const sequelize = require('../util/db.js');

const errorHelper = require('../util/error.js');
const onboardingQuestion = require('../util/onboardingQuestions.js');

const expValidatorRes = require('express-validator').validationResult;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ENUM = require('../util/enum.js');

const User = require('../models/user/user.js');
const UserLevel = require('../models/user/userLevel.js');
const AreaOfLife = require('../models/areaOfLife/areaOfLife.js');


exports.signup = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed.', 422, errors));
  }

  const name = req.body.name;
  const email = req.body.email;
  const birthdate = req.body.birthdate;
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  try {
    const userLevel1 = await UserLevel.findOne({ where: { level: 1 } });

    const user = await User.create({
      name: name,
      email: email,
      dateBirth: birthdate,  // Mudar o model User de dateBirth para birthdate
      password: hashedPassword,
      userLevelId: userLevel1.id,
    })

    const token = jwt.sign({
      email: user.email,
      userId: user.id.toString()
    }, process.env.JWT_SECRET,
      // { expireIn: '1h'}
    );

    console.log(`User ${user.name} (id:${user.id}) created account.`) // CONSOLE
    res.status(201).json({
      message: 'User created successfully!',
      userId: user.id,
      token: token,
      procrastinationType: user.procrastinationType.toString(),
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
  console.log(req.email)
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed.', 422, errors));
  }

  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    loadedUser = await User.findOne({ where: { email: email } });
    if (!loadedUser) {
      throw errorHelper.controllerErrorObj('User with email not found.', 401, errors);
    }
    const doMatch = await bcrypt.compare(password, loadedUser.password);
    if (!doMatch) {
      throw errorHelper.controllerErrorObj('Invalid password.', 401, errors);
    }
    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser.id.toString()
    }, process.env.JWT_SECRET,
      // { expireIn: '1h'}
    );
    console.log(`User ${loadedUser.name} (id:${loadedUser.id}) logged in.`) // CONSOLE
    res.status(200).json({
      token: token,
      userId: loadedUser.id.toString(),
      procrastinationType: loadedUser.procrastinationType.toString(),
    }
    );
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getOnboardingQuestions = async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Fetched Onboard Questions successfully.',
      questions: onboardingQuestion
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.onboarding = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed.', 422, errors));
  };

  const transaction = await sequelize.transaction();

  try {
    // Account Type
    const loadedUser = await User.findOne({ where: { id: req.userId } });
    if (!loadedUser) {
      throw errorHelper.controllerErrorObj('User not authenticated.', 401, errors);
    }

    const accountType = req.body.accountType;

    await User.update(
      { procrastinationType: accountType },
      { where: { id: req.userId } },
      { transaction }
    );

    // Area Of Life desirables and most praticeds
    const { desirable, mostPracticed } = req.body;

    const desirableAreas = await AreaOfLife.findAll(
      { where: { name: desirable } },
      { transaction }
    );

    const mostPracticedAreas = await AreaOfLife.findAll(
      { where: { name: mostPracticed } },
      { transaction }
    );

    for (const area of desirableAreas) {
      await loadedUser.addAreaOfLife(area,
        { through: { preferenceType: ENUM.USER_AREAOFLIFE_CONFIG[0] } },
        { transaction }
      );
    }

    for (const area of mostPracticedAreas) {
      await loadedUser.addAreaOfLife(area,
        { through: { preferenceType: ENUM.USER_AREAOFLIFE_CONFIG[1] } },
        { transaction }
      );
    }

    await transaction.commit();

  }
  catch (err) {
    await transaction.rollback();

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
