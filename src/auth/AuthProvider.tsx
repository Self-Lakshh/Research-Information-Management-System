import { useRef, useImperativeHandle, forwardRef } from 'react';
import AuthContext from './AuthContext';
import appConfig from '@/configs/app.config';
import { useSessionUser, useToken } from '@/store/authStore';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { useNavigate } from 'react-router-dom';
import { signIn as firebaseSignIn, logout as firebaseSignOut } from '@/services/firebase';
import { getUserById } from '@/services/firebase';
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth';
import type { ReactNode, Ref } from 'react';
import type { NavigateFunction } from 'react-router-dom';

type AuthProviderProps = { children: ReactNode };

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction;
};

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef, {}>((_, ref) => {
    const navigate = useNavigate();

    useImperativeHandle(
        ref,
        () => {
            return {
                navigate,
            };
        },
        [navigate]
    );

    return <></>;
});

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn);
    const user = useSessionUser((state) => state.user);
    const setUser = useSessionUser((state) => state.setUser);
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn);
    const { token, setToken } = useToken();

    const authenticated = Boolean(token && signedIn);

    const navigatorRef = useRef<IsolatedNavigatorRef>(null);

    const redirect = (userRole?: string) => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const redirectUrl = params.get(REDIRECT_URL_KEY);

        console.log('🔀 Redirect called with role:', userRole);

        if (redirectUrl) {
            console.log('📍 Redirecting to URL param:', redirectUrl);
            navigatorRef.current?.navigate(redirectUrl);
        } else {
            // Role-based routing
            const destination = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
            console.log('📍 Role-based redirect:', { userRole, destination });
            navigatorRef.current?.navigate(destination);
        }
    };

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken);
        setSessionSignedIn(true);

        if (user) {
            setUser(user);
        }
    };

    const handleSignOut = () => {
        setToken('');
        setUser({});
        setSessionSignedIn(false);
    };

    const signIn = async (values: SignInCredential): AuthResult => {
        try {
            const firebaseUser = await firebaseSignIn(values.email, values.password);
            const userData = await getUserById(firebaseUser.uid);

            console.log('🔍 Login Debug:', {
                uid: firebaseUser.uid,
                email: userData?.email,
                user_role: userData?.user_role,
                userData: userData
            });

            if (!userData) {
                throw new Error('User data not found');
            }

            if (!userData.is_active) {
                throw new Error('Your account has been deactivated. Please contact administrator.');
            }

            handleSignIn({ accessToken: firebaseUser.uid }, {
                ...userData,
                userId: userData.uid,
                email: userData.email,
                avatar: userData.profile_picture_url || '',
                userName: userData.name,
                authority: [userData.user_role === 'admin' ? 'admin' : 'user'],
            });

            console.log('🚀 Redirecting user with role:', userData.user_role);
            redirect(userData.user_role);

            return {
                status: 'success',
                message: '',
            };
        } catch (errors: any) {
            console.error('❌ Login error:', errors);
            return {
                status: 'failed',
                message: errors?.message || errors.toString(),
            };
        }
    };

    const signUp = async (values: SignUpCredential): AuthResult => {
        // Signup is disabled - only admin can create users
        return {
            status: 'failed',
            message: 'Self-registration is disabled. Please contact administrator to create an account.',
        };
    };

    const signOut = async () => {
        try {
            await firebaseSignOut();
        } finally {
            handleSignOut();
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath);
        }
    };

    const oAuthSignIn = (callback: (payload: OauthSignInCallbackPayload) => void) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    );
}

export default AuthProvider;
