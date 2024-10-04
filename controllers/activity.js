const Activity = require('../models/activity');


exports.createActivity = (req, res, next) => {
  const { title, description, activityType } = req.body;

  Activity.create({
    title: title,
    description: description,
    activityType: activityType
  })
    .then(activity => {
      res.status(201).json({ message: 'Activity created successfully!', activity: activity });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to create activity', error: err });
    });
};
