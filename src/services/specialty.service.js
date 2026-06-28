'use strict';

const { Specialty, Doctor } = require('../models');
const { Op } = require('sequelize');

const getAll = async (query = {}) => {
  const { search, isActive } = query;
  const where = {};
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (isActive !== undefined) where.isActive = isActive === 'true';

  return Specialty.findAll({
    where,
    include: [{ model: Doctor, as: 'doctors', attributes: ['id'], where: { isActive: true }, required: false }],
    order: [['name', 'ASC']]
  }).then(rows => rows.map(s => ({
    ...s.toJSON(),
    doctorCount: s.doctors.length
  })));
};

const getById = async (id) => {
  const s = await Specialty.findByPk(id, {
    include: [{
      model: Doctor, as: 'doctors',
      where: { isActive: true }, required: false,
      attributes: ['id', 'fullName', 'title', 'experience', 'consultationFee', 'rating', 'avatarUrl']
    }]
  });
  if (!s) throw Object.assign(new Error('Chuyên khoa không tồn tại'), { statusCode: 404 });
  return s;
};

const create = async (data) => {
  const exists = await Specialty.findOne({ where: { name: data.name } });
  if (exists) throw Object.assign(new Error('Tên chuyên khoa đã tồn tại'), { statusCode: 409 });
  return Specialty.create(data);
};

const update = async (id, data) => {
  const s = await Specialty.findByPk(id);
  if (!s) throw Object.assign(new Error('Chuyên khoa không tồn tại'), { statusCode: 404 });
  return s.update(data);
};

const remove = async (id) => {
  const s = await Specialty.findByPk(id);
  if (!s) throw Object.assign(new Error('Chuyên khoa không tồn tại'), { statusCode: 404 });
  await s.update({ isActive: false });
};

module.exports = { getAll, getById, create, update, remove };
