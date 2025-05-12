export function buildActivityUpdateData(data, userId) {
  const fields = ['title', 'description', 'importance', 'difficulty', 'createdAt'];
  const updateData = {};

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    };
  };

  updateData.userId = userId;
  return updateData;
};