import env from "../env";

test("should have env", () => {
  expect(process.env).toBeDefined();
  expect(env).not.toThrow();
});
