import * as Hapi from "@hapi/hapi";
import { predictService } from "./predict.service";

async function handlePrediction(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  try {
    const payload = request.payload as { file: any };
    const file = payload.file;

    if (!file) {
      return h
        .response({
          status: "error",
          message: "Tidak ada file yang diunggah.",
          code: 400,
        })
        .code(400);
    }

    
    let contentType = file.hapi.headers["content-type"];
    const filename = file.hapi.filename || "";

    if (!contentType) {
      console.log(
        "Content-Type header is missing, attempting to infer from filename..."
      );
      const fileExt = filename.split(".").pop()?.toLowerCase();
      if (fileExt === "csv") {
        contentType = "text/csv";
      } else if (fileExt === "xlsx") {
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      } else if (fileExt === "xls") {
        contentType = "application/vnd.ms-excel";
      }
    }

    if (!contentType) {
      return h
        .response({
          status: "error",
          code: 400,
          message:
            "Tidak dapat menentukan tipe file. Harap sertakan header Content-Type atau gunakan ekstensi file yang valid(.csv, .xlsx, .xls).",
        })
        .code(400);
    }

    const { id: userId } = request.auth.credentials;
    const result = await predictService.createPrediction(
      file,
      contentType,
      userId
    );

    return h
      .response({
        status: "success",
        code: 200,
        message: "Prediksi berhasil.",
        data: result,
      })
      .code(200);
  } catch (error: any) {
    console.error("Prediction error:", error);
    request.log("error", error);
    return h
      .response({
        status: "error",
        code: 500,
        message: "Terjadi kesalahan saat memproses prediksi.",
        error: error.message,
      })
      .code(500);
  }
}

async function handleGetPredictions(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  try {
    const { id: userId } = request.auth.credentials;
    const predictions = await predictService.getPredictionsByUserId(userId);

    if (predictions.length === 0) {
      return h
        .response({
          status: "success",
          code: 200,
          message: "Data masih kosong, silahkan upload csv/excel",
          data: [],
        })
        .code(200);
    }

    return h
      .response({
        status: "success",
        code: 200,
        message: "Hasil prediksi berhasil diambil",
        data: predictions,
      })
      .code(200);
  } catch (error: any) {
    console.error("Get predictions error:", error);
    request.log("error", error);
    return h
      .response({
        status: "error",
        code: 500,
        message: "Terjadi kesalahan saat mengambil hasil prediksi.",
        error: error.message,
      })
      .code(500);
  }
}

export const predictController = {
  handlePrediction,
  handleGetPredictions,
};
