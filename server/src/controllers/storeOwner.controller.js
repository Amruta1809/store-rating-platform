const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// GET /api/store-owner/dashboard — raters list + average rating for the logged-in owner's store
async function dashboard(req, res, next) {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'No store is registered to this account yet' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgResult = await Rating.findOne({
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
      where: { storeId: store.id },
      raw: true,
    });

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avgResult?.avgRating ? parseFloat(avgResult.avgRating) : null,
      raters: ratings.map((r) => ({
        ratingId: r.id,
        rating: r.rating,
        user: r.user,
        ratedAt: r.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard };
