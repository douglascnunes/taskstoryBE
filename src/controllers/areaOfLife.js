const AreaOfLife = require("../models/areaOfLife/areaOfLife");

exports.getAllAreasOfLife = async (req, res, next) => {
  try {
    const areasOfLife = await AreaOfLife.findAll();
    res.status(200).json({
      message: 'Fetched All Areas Of Life successfully.',
      areasOfLife: areasOfLife
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};