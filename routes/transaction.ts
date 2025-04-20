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
transactionRoute.get('/list/:id', async ({ params }: { params: { id: string } }) => {
  try {
    const result = await db.query.transactions.findMany({
      where: (fields, { eq }) => eq(fields.list_id, Number(params.id))
    });

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

    const updated = await db.update(transactions)
      .set(updateData)
      .where(eq(transactions.id, id));

    if (updated.changes === 0)
      return { success: false, message: "Transaction not found or not updated" };

    return { success: true, message: "Transaction updated", updated };
  } catch (err) {
    console.error("Update Error:", err);
    return { success: false, message: "Failed to update transaction" };
  }
});

// DELETE
transactionRoute.delete('/delete', async ({ body }: { body: { id: number } }) => {
  try {
    const deleted = await db.delete(transactions)
      .where(eq(transactions.id, body.id));

    if (deleted.changes === 0)
      return { success: false, message: "Transaction not found or not deleted" };

    return { success: true, message: "Transaction deleted", deleted };
  } catch (err) {
    console.error("Delete Error:", err);
    return { success: false, message: "Failed to delete transaction" };
  }
});
