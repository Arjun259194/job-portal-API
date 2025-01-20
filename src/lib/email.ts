import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import handlebars from "handlebars";
import path from "path";
import fs from "node:fs/promises";
import Mail from "nodemailer/lib/mailer";

export class MailBuilder {
  #from: string;
  #to: string;
  #subject: string;
  #template: (typeof this.templates)[number];
  #templateParams: Record<string, number | boolean | string> | null;
  private templates;

  constructor() {
    this.#from = this.#to = this.#subject = "";
    this.templates = ["test", "welcome", null] as const;
    this.#template = null;
    this.#templateParams = null;
  }

  private async loadTempates(template: (typeof this.templates)[number]) {
    const filePath = path.join(
      __dirname,
      "../../templates/mail",
      `${template}.hbs`,
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    const mailTamplate = handlebars.compile(fileContent);
    return mailTamplate;
  }

  async build() {
    const ALL_FIELDS_SET =
      this.#from &&
      this.#to &&
      this.#subject &&
      this.#template &&
      this.#templateParams;

    if (!ALL_FIELDS_SET)
      throw new Error("Can't build mail, still in default form");

    const mailTemplate = await this.loadTempates(this.#template);
    return {
      from: this.#from,
      to: this.#to,
      subject: this.#subject,
      html: mailTemplate(this.#templateParams).trim(),
    } satisfies Mail.Options;
  }

  public from(x: string) {
    this.#from = x;
    return this;
  }

  public to(x: string) {
    this.#to = x;
    return this;
  }

  public subject(x: string) {
    this.#subject = x;
    return this;
  }

  public template(x: (typeof this.templates)[number]) {
    this.#template = x;
    return this;
  }

  public templateParams(x: Record<string, number | boolean | string>) {
    this.#templateParams = x;
    return this;
  }
}

export default class SMTPService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(config: { user: string; pass: string }) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: config,
    });
  }

  public async sendMail(mail: MailBuilder) {
    const config = await mail.build();
    await this.transporter.sendMail(config);
  }
}
