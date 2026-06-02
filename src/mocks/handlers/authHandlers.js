import { http, HttpResponse } from "msw";
import { users } from "../data/users.js"

export const authHandlers = [

    http.post("/api/auth/login", async ({ request }) => {

        const body = await request.json();

        const user = users.find(
            u =>
                u.username === body.username &&
                u.password === body.password
        );

        if (!user) {
            return HttpResponse.json(
                {
                    message: "Invalid credentials"
                },
                {
                    status: 401
                }
            );
        }

        return HttpResponse.json({
            token: `fake-token-${user.id}`,
            user:{
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    })

];