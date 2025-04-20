import Elysia from "elysia";
import bcrypt from 'bcrypt';
import { db } from "../db/client";
import { accounts } from "../db/schema";

const accountRoute = new Elysia({prefix: "/account"});

// Register
accountRoute.post('/register', async ({ body }: { body: { username: string, password: string, confirm_password: string } }) => {
    try {
        const { username, password, confirm_password } = body;

        // Check if user exists
        const existing_user = await db.query.accounts.findFirst({
            where: (fields, { eq }) => eq(fields.username, username)
        });

        if (existing_user) {
            return { success: false, message: 'Username already used.' };
        }

        // Confirm password
        if (password !== confirm_password) {
            return { success: false, message: 'Incorrect confirm password.' };
        }

        // Hash Password
        const hashed_password = await bcrypt.hash(password, 10);

        // Insert User
        await db.insert(accounts).values({
            username,
            password: hashed_password,
        });

        return { success: true, message: 'Account successfully created!' };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message: 'Something went wrong during registration.',
            error: error instanceof Error ? error.message : String(error)
        };
    }
});

// Login
accountRoute.post('/login', async ({ body }: { body: { username: string, password: string } }) => {
    try {
        const { username, password } = body;

        // Check if account exists
        const account = await db.query.accounts.findFirst({
            where: (fields, { eq }) => eq(fields.username, username)
        });

        if (!account) {
            return { success: false, message: 'Incorrect username or password.' };
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return { success: false, message: 'Incorrect username or password.' };
        }

        // Successful login
        return { success: true, message: 'Login successful!', account };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: 'Something went wrong during login.',
            error: error instanceof Error ? error.message : String(error)
        };
    }
});

export default accountRoute;

