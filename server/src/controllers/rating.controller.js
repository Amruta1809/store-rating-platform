const { Store, Rating } = require('../models');

// PUT /api/ratings/:storeId — upsert: submits a new rating or modifies the existing one
async function upsertRating(req, res, next) {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [record, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { rating },
    });

    if (!created) {
      record.rating = rating;
      await record.save();
    }

    res.status(created ? 201 : 200).json({ rating: record });
  } catch (err) {
    next(err);
  }
}

module.exports = { upsertRating };
