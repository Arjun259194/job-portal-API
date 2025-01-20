import env from "../env";
import AuthToken from "../lib/auth";

beforeAll(() => {
  env();
  jest.spyOn(console, "error").mockImplementation(() => { }); // Mock console.error
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore(); // Cast to jest.Mock and restore the original function
});

describe("Auth token Tests", () => {
  const DUMMY_DATA = {
    id: "b716a7df-dc46-418e-bc63-9d124624144b",
    email: "arjun259194@gmail.com",
  };

  const payload = new AuthToken(DUMMY_DATA);

  test("should serialize and deserialize a token correctly", () => {
    const token = payload.serialize();

    expect(token).toBeDefined();

    const newPayload = AuthToken.from(token);

    expect(newPayload).toBeDefined();
    expect(newPayload?.data).toEqual(payload.data);
  });

  describe("Error handling", () => {
    test("Should throw error for invalid payload", () => {
      const inValidPayload = {
        id: "not an id",
        email: "not an email",
      };

      expect(() => new AuthToken(inValidPayload)).toThrow();
    });

    test("Should return undefined for invalid token", () => {
      const token1 = "Not a real token";
      const payload1 = AuthToken.from(token1);
      expect(payload1).toBeUndefined();

      const token2 = "";
      const payload2 = AuthToken.from(token2);
      expect(payload2).toBeUndefined();
    });
  });

  describe("Checking token expiring", () => {
    const tokenExpireTime = 10; //sec

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("should not expire before the given expire time", () => {
      const token = payload.serialize(tokenExpireTime);

      jest.advanceTimersByTime(2 * 1000);

      const beforeExpirePayload = AuthToken.from(token);
      expect(beforeExpirePayload).toBeDefined();
    });

    // This test is failing, startt from here good night
    test("should expire after the given expire time", () => {
      const token = payload.serialize(tokenExpireTime);

      jest.advanceTimersByTime((tokenExpireTime + 1) * 1000);

      const afterExpirePayload = AuthToken.from(token);
      expect(afterExpirePayload).toBeUndefined();
    });
  });
});
