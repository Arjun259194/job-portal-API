import env from "../env";

beforeAll(env);

test("should have env", () => {
  expect(process.env).toBeDefined();
});
