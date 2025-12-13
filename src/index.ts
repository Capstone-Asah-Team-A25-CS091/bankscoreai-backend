import * as Hapi from "@hapi/hapi";
import * as dotenv from "dotenv";
import HapiPino from "hapi-pino";
dotenv.config();
import authRoutes from "./api/auth";
import { loadModel } from "./api/predict/predict.service";
import predictRoutes from "./api/predict";
import { authPlugin } from "./middlewares/auth";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"], // a more restrictive origin is better for production
      },
    },
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
  server.route(predictRoutes);

  // Eagerly load the model at startup
  try {
    server.log('info', 'Pre-loading machine learning model...');
    await loadModel();
  } catch (err) {
    server.log('error', 'Failed to load machine learning model during startup.');
    console.error(err);
    process.exit(1);
  }

  await server.start();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
