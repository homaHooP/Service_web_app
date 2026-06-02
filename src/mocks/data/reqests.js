export let requests = [
    {
        id: 1,
        userId: 2,
        operatorId: 0,
        user: "Client",
        priority: "low",
        title: "Laptop keyboard isn't working properly, bla bla bla bla bla bla bla bla bla bla bla bla",
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        category: "Hardware",
        status: "unresolved",
        comments: [],
        history: []
    },
    {
        id: 2,
        userId: 2,
        operatorId: 1,
        user: "Client",
        priority: "medium",
        title: "Critical windows error",
        desc: "Lorem Ipsum",
        category: "OS",
        status: "in progress",
        comments: ["Have you tried reinstalling the drivers?","AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
        history:  ["Operator Admin took the request", "I will try searching the web to find a solution","Found the solution, i can start fixing the problem"]
    },
    {
        id: 3,
        userId: 3,
        operatorId: 0,
        user: "Client2",
        priority: "high",
        title: "Disc drive is broken, can't continue working",
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        category: "Hardware",
        status: "unresolved",
        comments: [],
        history: []
    }
];