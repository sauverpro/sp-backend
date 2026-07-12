const dotenv = require("dotenv");
const dns = require("node:dns");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    FullNames: String,
    Profile: String,
    Email: String,
    PhoneNumber: Array,
    IdNumber: String,
    Location: Array,
    Password: String,
    Role: String,
  },
  { strict: false, timestamps: true }
);

const stationSchema = new mongoose.Schema(
  {
    StationName: String,
    Location: String,
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { strict: false, timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);
const Station =
  mongoose.models.stations || mongoose.model("stations", stationSchema);

const seedUsers = [
  {
    key: "Admin",
    FullNames: "Seed Admin",
    Email: "admin@spgas.com",
    PhoneNumber: ["0780000001"],
    IdNumber: "1199911111111111",
    Location: ["Kigali"],
    Role: "Admin",
    Password: "Admin@123",
  },
  {
    key: "Manager",
    FullNames: "Seed Manager",
    Email: "manager@spgas.com",
    PhoneNumber: ["0780000002"],
    IdNumber: "2199922222222222",
    Location: ["Kigali"],
    Role: "Manager",
    Password: "Manager@123",
  },
  {
    key: "Customer",
    FullNames: "Seed Customer",
    Email: "customer@spgas.com",
    PhoneNumber: ["0780000003"],
    IdNumber: "3199933333333333",
    Location: ["Kigali"],
    Role: "Customer",
    Password: "Customer@123",
  },
];

const connectMongo = async () => {
  const mongoUri = process.env.DB_CONNECT;
  const mongoDirectUri = process.env.DB_CONNECT_DIRECT;

  if (!mongoUri) {
    throw new Error("DB_CONNECT is not set in .env");
  }

  try {
    await mongoose.connect(mongoUri);
    return;
  } catch (error) {
    const isSrvLookupIssue =
      error?.message?.includes("querySrv") ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ENOTFOUND";

    if (isSrvLookupIssue) {
      const dnsServers = (process.env.MONGO_DNS_SERVERS || "1.1.1.1,8.8.8.8")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (dnsServers.length > 0) {
        try {
          dns.setServers(dnsServers);
          await mongoose.connect(mongoUri);
          return;
        } catch (dnsRetryError) {
          if (!mongoDirectUri) {
            throw dnsRetryError;
          }
        }
      }
    }

    if (mongoDirectUri) {
      await mongoose.connect(mongoDirectUri);
      return;
    }

    throw error;
  }
};

const upsertUser = async (data) => {
  const saltRounds = Number.parseInt(process.env.slatRound || "10", 10);
  const hash = await bcrypt.hash(data.Password, await bcrypt.genSalt(saltRounds));

  const payload = {
    FullNames: data.FullNames,
    Email: data.Email,
    PhoneNumber: data.PhoneNumber,
    IdNumber: data.IdNumber,
    Location: data.Location,
    Role: data.Role,
    Password: hash,
  };

  const user = await User.findOneAndUpdate(
    { Email: data.Email },
    payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return user;
};

const ensureManagerStation = async (managerUserId) => {
  const existingStation = await Station.findOne({ managerId: managerUserId });
  if (existingStation) {
    return existingStation;
  }

  const station = await Station.create({
    StationName: "Seed Main Station",
    Location: "Kigali",
    managerId: managerUserId,
  });

  return station;
};

const run = async () => {
  try {
    await connectMongo();

    const created = [];
    for (const item of seedUsers) {
      const user = await upsertUser(item);
      created.push({
        role: item.key,
        email: item.Email,
        phone: item.PhoneNumber[0],
        password: item.Password,
        id: user._id.toString(),
      });

      if (item.Role === "Manager") {
        const station = await ensureManagerStation(user._id);
        console.log(`Manager station ready: ${station._id.toString()}`);
      }
    }

    console.log("\nSeed completed. Login credentials:");
    for (const entry of created) {
      console.log(
        `- ${entry.role}: phone=${entry.phone}, password=${entry.password}, email=${entry.email}`
      );
    }
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
