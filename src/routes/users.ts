import passport from 'passport';
// import { verifyToken } from './../middlewares/auth';
import express, { Request, Response } from 'express';
import {
  getUserTests,
  login,
  logout,
  signUp,
  getUserLikeTests,
  updateUser,
  getUserParticipatedTests,
  deleteUser,
} from '../controllers/users';
// import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

// 회원가입
router.post('/signup', signUp);

// 로그인
router.post('/login', login);

// 로그아웃
router.post('/logout', verifyToken, logout);

// 유저 정보 수정
router.put('/update', verifyToken, updateUser);

// 회원 탈퇴
router.delete('/delete', verifyToken, deleteUser);

// 유저가 낸 테스트
router.get('/tests', verifyToken, getUserTests);

// 유저가 좋아요 한 테스트
router.get('/likes', verifyToken, getUserLikeTests);

// 유저가 참여한 테스트
router.get('/join', verifyToken, getUserParticipatedTests);

/* 소셜로그인 시 토큰 발급 */
// 토큰 발급 함수
function issueToken(user: Express.User) {
  const { userId, username, profileUrl } = user;
  return jwt.sign({ userId, username, profileUrl }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
}

// 응답 처리 함수
function sendTokenResponse(req: Request, res: Response) {
  if (req.user) {
    const { userId, username, profileUrl } = req.user;
    const token = issueToken(req.user);

    res.cookie('accessToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
    });

    const redirectUrl = `${process.env
      .CLIENT_URL!}?userId=${userId}&nickname=${encodeURIComponent(
      username,
    )}&profileUrl=${encodeURIComponent(profileUrl || '')}`;
    res.redirect(redirectUrl);
  } else {
    res.status(401).send('Unauthorized');
  }
}

/* 카카오 로그인 */
router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/login',
    session: false,
  }),
  sendTokenResponse,
);

/* 구글 로그인 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  sendTokenResponse,
);

// 프로필 수정
// router.put(
//   '/profile',
//   verifyToken,
//   ensureAuthenticated,
//   imageUpload,
//   editProfile,
// );

export default router;
