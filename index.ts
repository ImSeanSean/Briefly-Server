import { Elysia } from 'elysia';
import 'bun';
import cors from "@elysiajs/cors";
import accountRoute from "./routes/account";
import listRoute from "./routes/list";
import { transactionRoute } from "./routes/transaction";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .onAfterHandle(({ request, set }) => {
    // Only process CORS requests
    if (request.method !== "OPTIONS") return;

    const allowHeader = set.headers["Access-Control-Allow-Headers"];
    if (allowHeader === "*") {
      set.headers["Access-Control-Allow-Headers"] =
        request.headers.get("Access-Control-Request-Headers") ?? "";
    }
  })
  .use(
    cors({
      origin: "*", // Allow all origins
      methods: "*", // Allow all HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Specify which headers are allowed (you can modify this as needed)
    })
  )
  .get("/", () => "Welcome to Briefly-Server!")
  .use(accountRoute)
  .use(listRoute)
  .use(transactionRoute);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Running on http://localhost:${port}`);
});
