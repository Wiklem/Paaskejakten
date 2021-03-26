import React from "react";
import { auth, authProvider } from "../utils/firebase";

interface Iuser {
  name: string | null;
  email: string | null;
}

interface IAuthContext {
  children?: JSX.Element;
  user?: Iuser;
  token?: string | null;
  signIn: any;
  signOut: any;
}

export const AuthContext = React.createContext<IAuthContext>({
  signIn: () => {},
  signOut: () => {},
});

const AuthProvider: React.FC = ({ children }) => {
  const [id, setId] = React.useState<string | null>();
  const [user, setUser] = React.useState<Iuser>();
  const [token, setToken] = React.useState<string | undefined | null>(
    undefined
  );

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(authProvider).then((res) => {
      if (res.user) {
        setUser({
          name: res.user.displayName,
          email: res.user.email,
        });
        res.user.getIdToken().then((token) => {
          setToken(token);
        });
      }
    });
  };

  const signOut = async () => {
    await auth.signOut().then(() => {
      setUser(undefined);
    });
  };

  auth.onAuthStateChanged(async (user) => {
    if (user && user.uid !== id) {
      user.getIdToken().then((token) => {
        setId(user.uid);
        setUser({
          name: user.displayName,
          email: user.email,
        });
        setToken(token);
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signOut,
        signIn: signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
