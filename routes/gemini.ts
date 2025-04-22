import { Elysia, t } from 'elysia';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const geminiRoute = new Elysia({ prefix: '/gemini' })
  .post(
    '/generate',
    async ({ body, set }) => {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: body.text,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          set.status = response.status;
          return {
            success: false,
            error: data.error?.message || 'Failed to generate content.',
          };
        }

        return {
          success: true,
          data,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          error: (error as Error).message || 'Internal Server Error',
        };
      }
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    }
  );
