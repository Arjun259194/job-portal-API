import { MailBuilder } from "../lib/email";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => { }); // Mock console.error
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore(); // Cast to jest.Mock and restore the original function
});

describe("Mail Builder Tests", () => {
  let builder: MailBuilder;

  beforeEach(() => {
    builder = new MailBuilder();
  });

  test("Should throw error if not config before build", async () => {
    await expect(builder.build()).rejects.toThrow(
      "Can't build mail, still in default form",
    );

    builder.from("ramesh");
    await expect(builder.build()).rejects.toThrow(
      "Can't build mail, still in default form",
    );

    builder
      .to("arjun259194@gmail.com")
      .subject("Nthing lol")
      .template("test")
      .templateParams({ somekey: "value" });

    await expect(builder.build()).resolves.not.toThrow();
  });

  test("Should build correct email object", async () => {
    const config = await builder
      .from("arjun259194@gmail.com")
      .to("param@gmail.com")
      .subject("Testing")
      .template("test")
      .templateParams({ somekey: "value" })
      .build();

    expect(config).toEqual({
      from: "arjun259194@gmail.com",
      to: "param@gmail.com",
      subject: "Testing",
      html: `<h1>value</h1>`,
    });
  });

  test("Should render correct template (ex. Welcome)", async () => {
    const tempConf = {
      username: "Arjun",
      unsubscribeLink: "#",
      year: new Date().getFullYear(),
    };
    const config = await builder
      .from("arjun259194@gmail.com")
      .to("param@gmail.com")
      .subject("Testing")
      .template("welcome")
      .templateParams(tempConf)
      .build();

    expect(config.html).toBe(`<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to [Your Service]</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0; padding: 0; background-color: #f7f7f7; } .email-container {
      max-width: 600px; margin: 30px auto; padding: 40px; background-color:
      #ffffff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
      .header { text-align: center; padding-bottom: 20px; } .header h1 {
      font-size: 36px; color: #2c3e50; margin: 0; font-weight: 600; }
      .welcome-message { font-size: 20px; color: #34495e; text-align: center;
      margin-bottom: 20px; } .main-content { font-size: 16px; color: #7f8c8d;
      line-height: 1.6; text-align: center; margin-bottom: 30px; } .cta-button {
      display: inline-block; padding: 12px 30px; background-color: #3498db;
      color: white; text-decoration: none; border-radius: 30px; font-size: 18px;
      transition: background-color 0.3s; } .cta-button:hover { background-color:
      #2980b9; } .remove-link { display: block; margin-top: 20px; font-size:
      14px; color: #e74c3c; text-decoration: none; text-align: center; }
      .remove-link:hover { text-decoration: underline; } .footer { text-align:
      center; font-size: 12px; color: #95a5a6; margin-top: 40px; } .footer a {
      color: #3498db; text-decoration: none; } .footer p { margin: 5px 0; }
      @media (max-width: 600px) { .email-container { padding: 20px; } .header h1
      { font-size: 28px; } .cta-button { font-size: 16px; padding: 10px 25px; }
      }
    </style>
  </head>
  <body>

    <div class="email-container">
      <div class="header">
        <h1>Welcome to [Your Service]!</h1>
      </div>

      <div class="welcome-message">
        <p>Hello ${tempConf.username},</p>
        <p>We are excited to have you with us! You're now part of the [Your
          Service] family. Thank you for joining.</p>
      </div>

      <div class="main-content">
        <p>We want to make sure you have the best experience. Explore our
          features and let us know if you need anything.</p>
        <p>We're here to assist you every step of the way!</p>
      </div>

      <a href="${tempConf.unsubscribeLink}" class="remove-link">Unsubscribe from this
        service</a>

      <div class="footer">
        <p>If you need any assistance, feel free to
          <a href="mailto:support@yourservice.com">contact us</a>.</p>
        <p>&copy; ${tempConf.year} [Your Service]. All rights reserved.</p>
      </div>
    </div>

  </body>
</html>`);
  });
});
