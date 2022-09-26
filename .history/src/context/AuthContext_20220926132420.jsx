import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Error from '../components/error/error';
import Header from '../components/header/header';

import Login from '../pages/login/login';

const AuthContext = createContext({});

const contextRef = createRef();

export function AuthProvider({ authService, authErrorEventBus, children }) {
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);
  console.log('auth');
  useImperativeHandle(contextRef, () => (user ? user.token : undefined));
  console.log(user);
  useEffect(() => {
    authErrorEventBus.listen((err) => {
      console.log(err);
      setUser(undefined);
    });
  }, [authErrorEventBus]);

  useEffect(() => {
    authService
      .me()
      .then((user) => setUser(user.loginId))
      .catch(setError);
  }, [authService]);

  const signUp = useCallback(
    async (nickname, loginId, password, email, sex, university, dept, sno) =>
      authService.signup(
        nickname,
        loginId,
        password,
        email,
        sex,
        university,
        dept,
        sno
      ),
    //.then((user) => setUser(user))
    [authService]
  );

  const logIn = useCallback(
    async (nickname, password) => {
      authService
        .login(nickname, password)
        .then((user) => {
          console.log(user, '1p1p1');
          return setUser(user.loginId);
        })
        .catch(setError);
    },

    [authService]
  );

  const logout = useCallback(
    async () =>
      authService
        .logout()
        .then(() => setUser(undefined))
        .catch(setError),
    [authService]
  );

  const emailVerification = useCallback(
    async (email) =>
      authService
        .emailVerification(email)
        .then((result) => result)
        .catch(setError),
    [authService]
  );

  const idDuplicateVerification = useCallback(
    async (loginId) =>
      authService
        .idDuplicateVerification(loginId)
        .then((data) => data)
        .catch(setError),
    [authService]
  );

  const authenticationNumberVerification = useCallback(
    async (number) =>
      authService
        .authenticationNumberVerification(number)
        .then((data) => data)
        .catch(setError),
    [authService]
  );

  const context = useMemo(
    () => ({
      user,
      signUp,
      logIn,
      logout,
      error,
      setError,
    }),
    [user, signUp, logIn, logout, error, setError]
  );

  const onError = (error) => setError();
  return (
    <AuthContext.Provider value={context}>
      {user ? (
        children
      ) : (
        <div className='app'>
          {error && <Error error={error} onError={setError} />}
          <Header />
          <Login
            onSignUp={signUp}
            onLogin={logIn}
            idDuplicateVerification={idDuplicateVerification}
            onEmailVerification={emailVerification}
            onAuthenticationNumberVerification={
              authenticationNumberVerification
            }
          />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export class AuthErrorEventBus {
  listen(callback) {
    this.callback = callback;
  }
  notify(error) {
    this.callback(error);
  }
}

export default AuthContext;
export const fetchToken = () => contextRef.current;
export const useAuth = () => useContext(AuthContext);
