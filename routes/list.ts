import Elysia from "elysia";
import { db } from "../db/client";
import { lists } from "../db/schema";
import { eq } from "drizzle-orm"; 

const listRoute = new Elysia({prefix: '/list'})

// CREATE
listRoute.post('/create', async ({ body }: { body: { name: string, account_id: number } }) => {
    try {
        const { name, account_id } = body;

        const list = await db.insert(lists).values({ name, account_id });

        return {
            success: true,
            message: "List created successfully",
            list
        };
    } catch (error) {
        console.error("Error creating list:", error);
        return {
            success: false,
            message: "Failed to create list.",
            error: error instanceof Error ? error.message : String(error)
        };
    }
});

// READ
listRoute.get('/get', async ({ query }) => {
    try {
        const account_id = Number(query.account_id);

        const list_data = isNaN(account_id)
            ? await db.select().from(lists)
            : await db.select().from(lists).where(eq(lists.account_id, account_id));

        if (!list_data || list_data.length === 0) {
            return {
                success: false,
                message: "No list found."
            };
        }

        return {
            success: true,
            lists: list_data
        };
    } catch (error) {
        console.error("Error fetching lists:", error);
        return {
            success: false,
            message: "Failed to fetch lists.",
            error: error instanceof Error ? error.message : String(error)
        };
    }
});

// UPDATE
listRoute.put('/update', async ({ body }: { body: { id: number, name: string } }) => {
    try {
        const { id, name } = body;

        const updated = await db.update(lists)
            .set({ name })
            .where(eq(lists.id, id));

        if (updated.changes === 0) {
            return { success: false, message: "List not found or not updated" };
        }

        return {
            success: true,
            message: "List updated successfully",
            updated
        };
    } catch (err) {
        console.error("Update Error:", err);
        return { success: false, message: "Something went wrong while updating the list." };
    }
});

// DELETE
listRoute.delete('/delete', async ({ body }: { body: { id: number } }) => {
    try {
        const { id } = body;

        const deleted = await db.delete(lists)
            .where(eq(lists.id, id));

        if (deleted.changes === 0) {
            return { success: false, message: "List not found or not deleted" };
        }

        return {
            success: true,
            message: "List deleted successfully",
            deleted
        };
    } catch (err) {
        console.error("Delete Error:", err);
        return { success: false, message: "Something went wrong while deleting the list." };
    }
});

export default listRoute;