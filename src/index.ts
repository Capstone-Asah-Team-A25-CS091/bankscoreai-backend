import * as Hapi from "@hapi/hapi";
import * as dotenv from "dotenv";
import HapiPino from "hapi-pino";
dotenv.config();
import authRoutes from "./api/auth";
import { authPlugin } from "./middlewares/auth";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  });

  await server.register(authPlugin);

  await server.register({
    plugin: HapiPino,
    options: {
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            }
          : undefined,
      logEvents: ["response", "onPostStart"],
    },
  });

  server.route(authRoutes);

  await server.start();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
