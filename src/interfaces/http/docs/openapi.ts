import swaggerJsdoc from "swagger-jsdoc";

export const openApiSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Motor de Priorização de Reposição de Estoque",
            version: "1.0.0",
            description: "API para gestão de peças e priorização de reposição de estoque.",
        },
        servers: [{ url: "http://localhost:3000" }],
        tags: [
            { name: "Health", description: "Monitoramento da aplicação" },
            { name: "Parts", description: "CRUD de peças" },
            { name: "Restock", description: "Priorização de reposição" },
        ],
        paths: {
            "/health": {
                get: {
                    tags: ["Health"],
                    summary: "Health check da aplicação",
                    responses: {
                        "200": {
                            description: "Aplicação saudável",
                        },
                    },
                },
            },
            "/parts": {
                get: {
                    tags: ["Parts"],
                    summary: "Lista peças com paginação",
                    parameters: [
                        {
                            name: "page",
                            in: "query",
                            schema: { type: "integer", minimum: 1, default: 1 },
                        },
                        {
                            name: "limit",
                            in: "query",
                            schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
                        },
                        {
                            name: "category",
                            in: "query",
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Lista paginada de peças",
                        },
                    },
                },
                post: {
                    tags: ["Parts"],
                    summary: "Cria uma peça",
                    responses: {
                        "201": { description: "Peça criada" },
                    },
                },
            },
            "/parts/{id}": {
                put: {
                    tags: ["Parts"],
                    summary: "Atualiza uma peça",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        "200": { description: "Peça atualizada" },
                        "404": { description: "Peça não encontrada" },
                    },
                },
                delete: {
                    tags: ["Parts"],
                    summary: "Remove uma peça",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        "204": { description: "Peça removida" },
                        "404": { description: "Peça não encontrada" },
                    },
                },
            },
            "/restock/priorities": {
                get: {
                    tags: ["Restock"],
                    summary: "Retorna prioridades de reposição",
                    responses: {
                        "200": {
                            description: "Prioridades ordenadas por urgência",
                        },
                    },
                },
            },
        },
    },
    apis: [],
});
