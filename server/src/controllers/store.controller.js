const { fn, col } = require('sequelize');
const { Store, Rating } = require('../models');
const { buildOrder, buildWhere } = require('../utils/queryHelpers');

// GET /api/stores — for normal users: search by name/address, see overall + own rating
async function listStoresForUser(req, res, next) {
  try {
    const where = buildWhere(req.query, ['name', 'address']);
    const order = buildOrder(req.query, ['id', 'name', 'createdAt']);

    const stores = await Store.findAll({ where, order });

    const storeIds = stores.map((s) => s.id);

    const averages = await Rating.findAll({
      attributes: ['storeId', [fn('AVG', col('rating')), 'avgRating']],
      where: { storeId: storeIds },
      group: ['storeId'],
    });
    const avgByStore = Object.fromEntries(
      averages.map((a) => [a.storeId, parseFloat(a.get('avgRating'))])
    );

    const myRatings = await Rating.findAll({
      where: { storeId: storeIds, userId: req.user.id },
    });
    const myRatingByStore = Object.fromEntries(myRatings.map((r) => [r.storeId, r.rating]));

    const result = stores.map((s) => {
      const json = s.toJSON();
      json.overallRating = avgByStore[s.id] || null;
      json.myRating = myRatingByStore[s.id] || null;
      return json;
    });

    res.json({ stores: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStoresForUser };
