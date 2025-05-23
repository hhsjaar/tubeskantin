import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authBem = async (userId) => {
    try {

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        if (user.publicMetadata.role === 'bem') {
            return true; // Return true if the user has the "bem" role
        } else {
            return false; // Return false if the user does not have the "bem" role
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export default authBem;
