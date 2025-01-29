import env from "../env";
import AuthToken, { Token } from "../lib/auth";

beforeAll(() => {
  env();
  jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore(); // Cast to jest.Mock and restore the original function
});

describe("Auth token Tests", () => {
  const DUMMY_TOKEN = new Token({
    id: "b716a7df-dc46-418e-bc63-9d124624144b",
    email: "arjun259194@gmail.com",
  });

  const tokenizer = new AuthToken(process.env.JWT_SECRET);

  test("should serialize and deserialize a token correctly", () => {
    const token = tokenizer.serialize(DUMMY_TOKEN);

    expect(token).toBeDefined();

    const newPayload = tokenizer.deserialize(token);

    expect(newPayload).toBeDefined();
    expect(newPayload?.data).toEqual(DUMMY_TOKEN.data);
  });

  describe("Error handling", () => {
    test("Should throw error for invalid payload", () => {
      const inValidPayload = {
        id: "not an id",
        email: "not an email",
      };

      expect(() => new Token(inValidPayload)).toThrow();
    });

    test("Should return undefined for invalid token", () => {
      const token1 = "Not a real token";
      const payload1 = tokenizer.deserialize(token1);
      expect(payload1).toBeUndefined();

      const token2 = "";
      const payload2 = tokenizer.deserialize(token2);
      expect(payload2).toBeUndefined();
    });
  });

  describe("Checking token expiring", () => {
    const tokenExpireTime = 5; //sec

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const DUMMY_DATA = {
      id: "ec6c74b1-ff0d-46ac-bceb-892b8809be87",
      email: "something244@gmail.com",
    };

    test("should not expire before the given expire time", () => {
      const stringToken = tokenizer.serialize(new Token(DUMMY_DATA));
      jest.advanceTimersByTime(2 * 1000);

      const beforeExpirePayload = tokenizer.deserialize(stringToken);
      expect(beforeExpirePayload).toBeDefined();
    });

    // This test is failing, startt from here good night
    test("should expire after the given expire time", () => {
      const stringToken = tokenizer.serialize(
        new Token(DUMMY_DATA),
        tokenExpireTime,
      );
      jest.advanceTimersByTime((tokenExpireTime + 1) * 1000);

      const afterExpirePayload = tokenizer.deserialize(stringToken);
      expect(afterExpirePayload).toBeUndefined();
    });
  });
});
