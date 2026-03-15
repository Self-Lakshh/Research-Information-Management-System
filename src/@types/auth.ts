export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    token: string
    user: {
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type Token = {
    accessToken: string
    refereshToken?: string
}
import type { User as FirebaseUser } from "@/services/firebase/users/types"

export interface User extends Partial<FirebaseUser> {
    userId?: string
    userName?: string
    authority?: string[]
    avatar?: string
    id?: string
    email?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
