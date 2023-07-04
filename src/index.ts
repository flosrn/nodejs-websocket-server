import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

console.log("FASTIFY_PORT : ", FASTIFY_PORT);

app.listen({ port: FASTIFY_PORT });

console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
console.log(`Route index: /`);
console.log(`Route user: /api/v1/user`);
