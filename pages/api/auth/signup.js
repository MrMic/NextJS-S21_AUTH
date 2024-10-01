import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;
  const { email, password } = data;

  if (!email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7) {
    res.status(422).json({
      message: "Invalid input - password should also be at least 7 characters long.",
    });
    return;
  }

  const client = await connectToDatabase();
  // * INFO: Name of the DB
  const db = client.db('auth-demo');

  const existingUser = await db
    .collection("users")
    .findOne({ email });

  if (existingUser) {
    res.status(422).json({ message: "User exists already!" });
    client.close();
    return;
  }

  const result = await db.collection("users").insertOne({
    email,
    password: await hashPassword(password),
  });

  res.status(201).json({ message: "Created user!" });
}
export default handler;
