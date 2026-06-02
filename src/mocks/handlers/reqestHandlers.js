import { http, HttpResponse } from "msw";
import { users } from "../data/users.js"
import { requests } from "../data/reqests.js"
import { categories } from "../data/categories.js";

function extractId(auth){
    return (auth?.split(" ")[1])?.split("-")[2];
}

export const requestHandlers = [

    http.get("/api/requests/all",() => HttpResponse.json(requests)),
    http.get("/api/requests/my", ({ request }) => {
        const auth = request.headers.get("Authorization");
        let userId = extractId(auth);
        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        const filtered = requests.filter(
            (req) => req.userId === Number(userId)
        );
        return HttpResponse.json(filtered);
    }),
    http.get("/api/requests/:id",({ request,params }) => {
        const {id} = params;
        const auth = request.headers.get("Authorization");
        let userId = extractId(auth);
        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        const target = requests.find((req)=>req.id === Number(id));
        if (!target) {
            return HttpResponse.json([], { status: 404 });
        }
        return HttpResponse.json(target,{ status: 201 });
    }),
    http.get("/api/categories",() => HttpResponse.json(categories)),
    http.post("/api/requests",async ({request}) => {
        const auth = request.headers.get("Authorization");
        let userId = extractId(auth);
        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        const body = await request.json();
        const user = users.find(
            (u) => u.id === Number(userId)
        );
        if (!user) {
            return HttpResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        const r = {
            id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
            userId: user.id,
            operatorId: 0,
            user: user.username,
            priority: body.priority,
            title: body.title,
            desc: body.description,
            category: body.category,
            status: "unresolved",
            comments: [],
            history: []
        }
        requests.push(r);
        return HttpResponse.json(r, { status: 201 });
    }),
    http.patch("/api/requests/:requestId/history/:index",({request,params})=>{
        const {requestId,index} = params;
        const requestIdNum = Number(requestId);
        const indexNum = Number(index);
        const auth = request.headers.get("Authorization");
        const target = requests.find((req)=>req.id === requestIdNum);
        let userId = extractId(auth);

        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        else if (!target) {
            return HttpResponse.json([], { status: 404 });
        }
        else if(indexNum <= 0 || indexNum >= target.history.length){
            return HttpResponse.json([], { status: 404 });
        }

        target.history.splice(indexNum,1);
        return HttpResponse.json(target.history, { status: 201 });
    }),
    http.post("/api/requests/:id/history", async ({request,params})=>{
        const auth = request.headers.get("Authorization");
        const {id} = params;
        const data = await request.text();

        let userId = extractId(auth);
        const target = requests.find((req)=>req.id === Number(id));
        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        else if(!target){
            return HttpResponse.json([], { status: 404 });
        }

        target.history.push(data);
        return HttpResponse.json(target.history, { status: 201 });
    }),
    http.post("/api/requests/:id/comments", async ({request,params})=>{
        const auth = request.headers.get("Authorization");
        const {id} = params;
        const data = await request.text();

        let userId = extractId(auth);
        const target = requests.find((req)=>req.id === Number(id));
        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        else if(!target){
            return HttpResponse.json([], { status: 404 });
        }

        target.comments.push(data);
        return HttpResponse.json(target.comments, { status: 201 });
    }),
    http.patch("/api/requests/:id/status", async ({request,params})=>{
        const auth = request.headers.get("Authorization");
        const {id} = params;
        const data = await request.json();

        let userId = extractId(auth);
        const target = requests.find((req)=>req.id === Number(id));
        const userTarget = users.find((user)=>user.id === data.op);

        if (!userId) {
            return HttpResponse.json([], { status: 401 });
        }
        else if(!target){
            return HttpResponse.json([], { status: 404 });
        }

        if (target.operatorId === 0) {
            target.operatorId = data.op;
            target.history.push(`Operator ${userTarget.username} took the request`);
        }
        else{
            target.history.push(`Operator ${userTarget.username} finished the job`);
        }
        target.status = data.status;

        return HttpResponse.json([target.operatorId,target.status,target.history], { status: 201 });
    })
];