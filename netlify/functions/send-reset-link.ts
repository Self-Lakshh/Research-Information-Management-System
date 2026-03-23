import { auth } from './utils/firebase-admin';

/**
 * Netlify Function: send-reset-link
 * 
 * Generates and sends a password reset link to the specified email.
 */
export const handler = async (event: any, context: any) => {
    if (event.httpMethod === 'OPTIONS') {
        return response(200, true, 'OK', null, true);
    }

    if (event.httpMethod !== 'POST') {
        return response(405, false, 'Method Not Allowed');
    }

    try {
        const { email } = JSON.parse(event.body || '{}');
        if (!email) return response(400, false, 'Email is required.');

        // Generate the reset link
        const link = await auth.generatePasswordResetLink(email);
        
        // In a real production app, you would integrate an email provider like SendGrid/Postmark
        // here to send the link to the user. Since this is an admin tool, we'll
        // flag it as successfully generated. In the frontend, we can tell the admin
        // that the link was created.
        
        console.log(`[send-reset-link] Link generated for ${email}: ${link}`);

        return response(200, true, 'Password reset link generated successfully.', { link });
    } catch (err: any) {
        console.error('[send-reset-link] Error:', err);
        return response(500, false, err.message || 'Error processing request.');
    }
};

function response(code: number, success: boolean, message: string, data: any = null, isCors: boolean = false) {
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST'
        },
        body: JSON.stringify({ success, message, data })
    };
}
