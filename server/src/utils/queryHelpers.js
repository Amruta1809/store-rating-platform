const { Op } = require('sequelize');

/**
 * Builds a Sequelize `order` array from ?sortBy=&order= query params.
 * Falls back to sorting by `id` ascending, and whitelists allowed columns
 * to prevent arbitrary-column SQL injection via query params.
 */
function buildOrder(query, allowedFields = ['id', 'name', 'email', 'createdAt']) {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : 'id';
  const order = String(query.order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return [[sortBy, order]];
}

/**
 * Builds a Sequelize `where` clause for simple case-insensitive
 * partial-match filters, e.g. ?name=foo&email=bar
 */
function buildWhere(query, filterableFields = ['name', 'email', 'address']) {
  const where = {};
  filterableFields.forEach((field) => {
    if (query[field]) {
      where[field] = { [Op.iLike]: `%${query[field]}%` };
    }
  });
  if (query.role) {
    where.role = query.role;
  }
  return where;
}

module.exports = { buildOrder, buildWhere };
