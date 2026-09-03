const bcrypt = require('bcryptjs');
const { Op, fn, col } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { buildOrder, buildWhere } = require('../utils/queryHelpers');

// GET /api/admin/dashboard
async function dashboard(req, res, next) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users — create a normal or admin (or store owner) user
async function createUser(req, res, next) {
  try {
    const { name, email, address, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: hashed,
      role: role || 'NORMAL',
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users — filterable, sortable list of NORMAL + ADMIN + STORE_OWNER users
async function listUsers(req, res, next) {
  try {
    const where = buildWhere(req.query, ['name', 'email', 'address']);
    const order = buildOrder(req.query, ['id', 'name', 'email', 'role', 'createdAt']);

    const users = await User.findAll({ where, order });

    // Attach rating (avg of their store's ratings) for STORE_OWNER users
    const storeOwnerIds = users.filter((u) => u.role === 'STORE_OWNER').map((u) => u.id);
    let ratingByOwner = {};
    if (storeOwnerIds.length) {
      const stores = await Store.findAll({ where: { ownerId: storeOwnerIds } });
      const storeByOwner = Object.fromEntries(stores.map((s) => [s.ownerId, s.id]));
      const averages = await Rating.findAll({
        attributes: ['storeId', [fn('AVG', col('rating')), 'avgRating']],
        where: { storeId: Object.values(storeByOwner) },
        group: ['storeId'],
      });
      const avgByStore = Object.fromEntries(
        averages.map((a) => [a.storeId, parseFloat(a.get('avgRating'))])
      );
      ratingByOwner = Object.fromEntries(
        Object.entries(storeByOwner).map(([ownerId, storeId]) => [
          ownerId,
          avgByStore[storeId] || null,
        ])
      );
    }

    const result = users.map((u) => {
      const json = u.toJSON();
      if (u.role === 'STORE_OWNER') {
        json.rating = ratingByOwner[u.id] ?? null;
      }
      return json;
    });

    res.json({ users: result });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id — full detail, includes rating if STORE_OWNER
async function getUserDetail(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const json = user.toJSON();

    if (user.role === 'STORE_OWNER') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const avg = await Rating.findOne({
          attributes: [[fn('AVG', col('rating')), 'avgRating']],
          where: { storeId: store.id },
          raw: true,
        });
        json.rating = avg?.avgRating ? parseFloat(avg.avgRating) : null;
        json.storeId = store.id;
        json.storeName = store.name;
      }
    }

    res.json({ user: json });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores — filterable, sortable list with average rating
async function listStores(req, res, next) {
  try {
    const where = buildWhere(req.query, ['name', 'email', 'address']);
    const order = buildOrder(req.query, ['id', 'name', 'email', 'createdAt']);

    const stores = await Store.findAll({ where, order });

    const averages = await Rating.findAll({
      attributes: ['storeId', [fn('AVG', col('rating')), 'avgRating']],
      where: { storeId: stores.map((s) => s.id) },
      group: ['storeId'],
    });
    const avgByStore = Object.fromEntries(
      averages.map((a) => [a.storeId, parseFloat(a.get('avgRating'))])
    );

    const result = stores.map((s) => {
      const json = s.toJSON();
      json.rating = avgByStore[s.id] || null;
      return json;
    });

    res.json({ stores: result });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/stores — create a store, optionally linked to a STORE_OWNER
async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    const existing = await Store.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A store with this email already exists' });
    }

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({ message: 'ownerId does not match any user' });
      }
      if (owner.role !== 'STORE_OWNER') {
        return res.status(400).json({ message: 'Assigned owner must have the STORE_OWNER role' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  dashboard,
  createUser,
  listUsers,
  getUserDetail,
  listStores,
  createStore,
};
