import { destroyCookie, setCookie } from 'nookies';
import { clearUser } from '@/store/userSlice';
import { useDispatch } from 'react-redux';
import { useAccessTokenRefreshMutation } from '@/api/userApi';

// 로그인 상태 확인 함수
export const useCheckLoginStatus = () => {
  const [accessTokenRefresh] = useAccessTokenRefreshMutation();
  const dispatch = useDispatch();

  // 액세스 토큰 재발급 함수
  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const result = await accessTokenRefresh(
        JSON.stringify({ refresh_token: refreshToken }),
      ).unwrap();

      // 액세스 토큰 다시 쿠키에 저장
      setCookie(null, 'access_token', result?.access_token, {
        maxAge: 60 * 60, // 쿠키 유효기간
        path: '/',
      });

      console.log('토큰 재발급 성공, 새로고침 1초 후 실행');
    } catch (err) {
      console.error('액세스 토큰 재발급 실패:', err);
      handleLogout('로그인이 만료되었습니다.');
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = (message: string) => {
    console.log(message);

    // 로컬 스토리지 초기화
    localStorage.removeItem('persist:user');
    localStorage.removeItem('auto_signin');

    // Redux 상태 초기화
    dispatch(clearUser());

    // 쿠키 삭제
    destroyCookie(null, 'access_token', { path: '/' });
    destroyCookie(null, 'refresh_token', { path: '/' });
  };

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const cookies = document.cookie.split('; ');
    const accessTokenCookie = cookies.find(row => row.startsWith('access_token'));
    const refreshTokenCookie = cookies.find(row => row.startsWith('refresh_token'));
    const refreshToken = refreshTokenCookie?.split('=')[1];
    const autoSignin = localStorage.getItem('auto_signin');

    if (autoSignin === 'true' && !accessTokenCookie && refreshTokenCookie) {
      // 자동 로그인 O
      // 리프레시 토큰으로 액세스 토큰 재발급
      refreshAccessToken(refreshToken as string);
    } else if (!accessTokenCookie && refreshTokenCookie) {
      // 자동 로그인 X
      // 리프레시 토큰은 있지만 액세스 토큰이 없을 때 로그아웃 처리
      handleLogout('로그인이 만료되었습니다.');
    }
  };

  return { checkLoginStatus };
};
