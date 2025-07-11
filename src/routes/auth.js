import express from 'express';
import { body } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import { AVATAR, PROCRASTINATION_TYPE } from '../util/enum.js';
import * as authController from '../controllers/auth.js';
import User from '../models/user/user.js';
import AreaOfLife from '../models/areaOfLife/areaOfLife.js';

const router = express.Router();

router.post('/signup', [
  body('name')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('O nome de usuário deve ter entre 3 e 30 caracteres.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('O nome de usuário só pode conter letras, números e underlines.'),

  body('email')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Por favor, insira um e-mail válido.')
    .isLength({ min: 4, max: 50 }).withMessage('O e-mail deve ter no mínimo 10 e máximo de 50 caracteres.')
    // .matches(/.+\.[a-zA-Z]{2,}$/).withMessage('O e-mail deve conter um domínio válido.')
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser) {
        throw new Error('E-mail já está em uso. Por favor, escolha outro.');
      }
      return true;
    }),

  body('password')
    .trim()
    .isLength({ min: 4, max: 30 }).withMessage('A senha deve ter pelo menos 8 e máximo de 30 caracteres.')
    // .matches(/\d/).withMessage('A senha deve conter pelo menos um número.')
    // .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula.')
    // .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula.')
    // .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('A senha deve conter pelo menos um caractere especial.')
    .not().contains(' ').withMessage('A senha não pode conter espaços.'),

  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('As senhas não coincidem.');
      }
      return true;
    }),

  body('birthdate')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('A data de nascimento deve estar no formato YYYY-MM-DD.'),
  // .custom((value) => {
  //   const today = new Date();
  //   const birthdate = new Date(value);
  //   const age = today.getFullYear() - birthdate.getFullYear();
  //   const month = today.getMonth() - birthdate.getMonth();
  //   if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) { age--; }
  //   if (age > 120) { throw new Error('A idade informada não é válida.'); }
  //   return true;
  // }),

  body('avatar')
    .isString().withMessage('O avatar deve ser uma string.')
    .custom((value) => {
      const allAvatars = Object.values(AVATAR).flat(); // ex: ['warrior.png', 'wizard.png', ...]
      if (!allAvatars.includes(value)) {
        throw new Error('Avatar inválido.');
      }
      return true;
    }),

],
  authController.signup);

router.post('/login', [
  body('email', 'Senha ou Email* inválido.')
    .custom((email) => {
      return true;
    })
    .trim()
    .normalizeEmail()
    .isEmail(),
  body('password', 'Senha* ou Email inválido.')
    .custom((password) => {
      return true;
    })
    .trim()
    .isLength({ min: 4, max: 30 }),
], authController.login);

router.get('/onboarding-questions', authController.getOnboardingQuestions);

router.patch('/onboarding', isAuth, [
  body('accountType', 'Tipo de conta desconhecida')
    .isString()
    .custom((type) => PROCRASTINATION_TYPE.includes(type)),

  body('desirable', 'Desejadas inválidas')
    .isArray()
    .custom(async (desirables) => {
      const areaOfLifeNames = await AreaOfLife.findAll({ attributes: ['name'] });
      return desirables.every(desire => areaOfLifeNames.includes(desire));
    })
    .withMessage('Cada elemento de areaOfLife.desirable deve ser um número inteiro entre 0 e 8.'),

  body('mostPracticed', 'Mais Praticadas inválidas')
    .isArray()
    .custom(async (mostPracticed) => {
      const areaOfLifeNames = await AreaOfLife.findAll({ attributes: ['name'] });
      return mostPracticed.every(practice => areaOfLifeNames.includes(practice));
    })
    .withMessage('Nomes das Áreas da Vida devem ser válidas.'),
], authController.onboarding);

export default router;