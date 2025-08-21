import { body, query, param } from 'express-validator';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export const vSignup = [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ min: 0, max: 400 }),
  body('password').matches(passwordRegex),
];

export const vLogin = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8, max: 100 }),
];

export const vPasswordUpdate = [
  body('oldPassword').isString(),
  body('newPassword').matches(passwordRegex),
];

export const vCreateUser = [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ min: 0, max: 400 }),
  body('password').matches(passwordRegex),
  body('role').isIn(['ADMIN', 'USER', 'OWNER'])
];

export const vCreateStore = [
  body('name').isLength({ min: 1, max: 120 }),
  body('email').optional({nullable: true}).isEmail().toLowerCase(),
  body('address').isLength({ min: 0, max: 400 }),
  body('ownerId').optional({nullable: true}).isInt(),
];

export const vStoreQuery = [
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['name','email','address','rating']),
  query('order').optional().isIn(['asc','desc']),
];

export const vIdParam = [ param('id').isInt() ];

export const vRating = [
  body('storeId').isInt(),
  body('score').isInt({ min: 1, max: 5 }),
];
