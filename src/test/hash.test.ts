import env from "../env";
import BcryptPasswordHash from "../lib/hash";

beforeAll(() => {
  env();
  jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore(); // Cast to jest.Mock and restore the original function
});

describe("Hashing Test", () => {
  const hashService = new BcryptPasswordHash(
    Number(process.env.PASSWORD_SALT_ROUNDS),
  );

  const password = "thisissuperstringpassword";

  describe("Hashing error testing", () => {
    test("Should throw error for incalid params in hash()", async () => {
      await expect(hashService.hash("")).rejects.toThrow(/Password/);
      await expect(hashService.hash(password)).resolves.not.toThrow();
    });

    test("Should throw error for invalid params in comapre()", async () => {
      const hash = await hashService.hash(password);
      await expect(hashService.compare("", "")).rejects.toThrow(/Password/);
      await expect(hashService.compare(password, "")).rejects.toThrow(/Hash/);

      await expect(hashService.compare(password, hash)).resolves.not.toThrow();
    });
  });

  describe("Testing for hashing and comparing", () => {
    test("Should generate unique hash", async () => {
      const [hashOne, hashTwo] = await Promise.all([
        await hashService.hash(password),
        await hashService.hash(password),
      ]);

      expect(hashOne).not.toEqual(hashTwo);
    });

    test("Should be a match with right hash-password pair", async () => {
      const hash = await hashService.hash(password);
      const isMatch = await hashService.compare(password, hash);
      expect(isMatch).toBe(true);
    });

    test("Should return false with wrong password and right hash", async () => {
      const hash = await hashService.hash(password);
      await expect(hashService.compare("wrongpassword", hash)).resolves.toBe(
        false,
      );
    });

    test("Should return false with right password and wrong hash", async () => {
      const differentHash = await hashService.hash("differentPassword");
      await expect(hashService.compare(password, differentHash)).resolves.toBe(
        false,
      );
    });
  });
});
