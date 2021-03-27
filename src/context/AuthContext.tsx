import React from "react";
import { auth, authProvider } from "../utils/firebase";

interface IAuthContext {
  children?: JSX.Element;
  uid: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  token?: string | null;
  signIn: any;
  signOut: any;
}

export const AuthContext = React.createContext<IAuthContext>({
  name: null,
  email: null,
  uid: null,
  signIn: () => {},
  signOut: () => {},
});

const AuthProvider: React.FC = ({ children }) => {
  const [name, setName] = React.useState<string | null | undefined>();
  const [email, setEmail] = React.useState<string | null | undefined>();
  const [uid, setUid] = React.useState<string | null | undefined>();
  const [token, setToken] = React.useState<string | undefined | null>(
    undefined
  );

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(authProvider).then((res) => {
      if (res.user) {
        setName(res.user.displayName);
        setEmail(res.user.email);
        setUid(res.user.uid);
        res.user.getIdToken().then((token) => {
          setToken(token);
        });
      }
    });
  };

  const signOut = async () => {
    await auth.signOut().then(() => {
      setName(null);
      setEmail(null);
      setUid(null);
    });
  };

  auth.onAuthStateChanged(async (newState) => {
    if (newState && newState.uid !== uid) {
      newState.getIdToken().then((token) => {
        setName(newState.displayName);
        setEmail(newState.email);
        setUid(newState.uid);
        setToken(token);
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        name,
        email,
        uid,
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
