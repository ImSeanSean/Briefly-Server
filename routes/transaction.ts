import { Elysia } from "elysia";
import { db } from "../db/client";
import { transactions } from "../db/schema";
import { eq } from "drizzle-orm";

export const transactionRoute = new Elysia({ prefix: '/transaction' });

// CREATE
transactionRoute.post('/create', async ({ body }: { body: {
  date: string,
  description: string,
  category: string,
  amount: number,
  list_id: number
} }) => {
  try {
    const transaction = await db.insert(transactions).values(body);
    return { success: true, message: "Transaction created", transaction };
  } catch (err) {
    console.error("Create Error:", err);
    return { success: false, message: "Failed to create transaction" };
  }
});

// READ
transactionRoute.get("/list/:id", async ({ params }) => {
  try {
    const listId = Number(params.id);
    if (isNaN(listId)) {
      return { success: false, message: "Invalid list ID" };
    }

    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.list_id, listId));

    return { success: true, transactions: result };
  } catch (err) {
    console.error("Read Error:", err);
    return { success: false, message: "Failed to fetch transactions" };
  }
});

// UPDATE
transactionRoute.put('/update', async ({ body }: { body: {
  id: number,
  date?: string,
  description?: string,
  category?: string,
  amount?: number
} }) => {
  try {
    const { id, ...updateData } = body;

    // Check if the transaction exists before updating
    const transaction = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);

    if (transaction.length === 0) {
      return { success: false, message: "Transaction not found" };
    }

    // Proceed with the update
    await db.update(transactions)
      .set(updateData)
      .where(eq(transactions.id, id));

    return { success: true, message: "Transaction updated" };
  } catch (err) {
    console.error("Update Error:", err);
    return { success: false, message: "Failed to update transaction" };
  }
});


// DELETE
transactionRoute.delete('/delete', async ({ body }: { body: { id: number } }) => {
  try {
    const { id } = body;

    // Check if the transaction exists before deleting
    const transaction = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);

    if (transaction.length === 0) {
      return { success: false, message: "Transaction not found" };
    }

    // Proceed with the deletion
    await db.delete(transactions).where(eq(transactions.id, id));

    return { success: true, message: "Transaction deleted" };
  } catch (err) {
    console.error("Delete Error:", err);
    return { success: false, message: "Failed to delete transaction" };
  }
});

