module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/app.ts",
        "src/core/middlewares/**/*.ts",
        "src/core/utils/**/*.ts",
        "src/modules/auth/**/*.ts",
        "src/modules/request/**/*.ts",
    ],
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40,
        },
    },
};
