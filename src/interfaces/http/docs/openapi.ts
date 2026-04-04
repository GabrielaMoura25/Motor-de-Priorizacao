import swaggerJsdoc from "swagger-jsdoc";

const APP_BASE_URL = process.env.APP_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

export const openApiSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Motor de Priorização de Reposição de Estoque",
            version: "1.0.0",
            description: "API para gestão de peças e priorização de reposição de estoque.",
        },
        servers: [{ url: APP_BASE_URL }],
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
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: [
                                        "name",
                                        "category",
                                        "currentStock",
                                        "minimumStock",
                                        "averageDailySales",
                                        "leadTimeDays",
                                        "unitCost",
                                        "criticalityLevel",
                                    ],
                                    properties: {
                                        name: { type: "string", example: "Filtro de Óleo X" },
                                        category: { type: "string", example: "engine" },
                                        currentStock: { type: "integer", minimum: 0, example: 15 },
                                        minimumStock: { type: "integer", minimum: 0, example: 20 },
                                        averageDailySales: { type: "number", minimum: 0, example: 4 },
                                        leadTimeDays: { type: "integer", minimum: 1, example: 5 },
                                        unitCost: { type: "number", exclusiveMinimum: 0, example: 18.5 },
                                        criticalityLevel: { type: "integer", minimum: 1, maximum: 5, example: 3 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        "201": { description: "Peça criada" },
                        "400": { description: "Dados inválidos" },
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
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string", example: "Filtro de Óleo X" },
                                        category: { type: "string", example: "engine" },
                                        currentStock: { type: "integer", minimum: 0, example: 15 },
                                        minimumStock: { type: "integer", minimum: 0, example: 20 },
                                        averageDailySales: { type: "number", minimum: 0, example: 4 },
                                        leadTimeDays: { type: "integer", minimum: 1, example: 5 },
                                        unitCost: { type: "number", exclusiveMinimum: 0, example: 18.5 },
                                        criticalityLevel: { type: "integer", minimum: 1, maximum: 5, example: 3 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        "200": { description: "Peça atualizada" },
                        "400": { description: "Dados inválidos" },
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
