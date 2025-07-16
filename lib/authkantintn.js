import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authkantintn = async (userId) => {
    try {

        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        if (user.publicMetadata.role === 'kantintn') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export default authkantintn;