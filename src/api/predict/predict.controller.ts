import * as Hapi from '@hapi/hapi';
import { predictService } from './predict.service';

async function handlePrediction(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  try {
    const payload = request.payload as { file: any };
    const file = payload.file;

    if (!file) {
      return h.response({ message: 'No file uploaded.' }).code(400);
    }

    // We will attempt to determine the file type first from the content-type header,
    // and fall back to the filename extension.
    let contentType = file.hapi.headers['content-type'];
    const filename = file.hapi.filename || '';

    if (!contentType) {
      console.log("Content-Type header is missing, attempting to infer from filename...");
      const fileExt = filename.split('.').pop()?.toLowerCase();
      if (fileExt === 'csv') {
        contentType = 'text/csv';
      } else if (fileExt === 'xlsx') {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (fileExt === 'xls') {
        contentType = 'application/vnd.ms-excel';
      }
    }

    if (!contentType) {
        return h.response({ message: 'Could not determine file type. Please upload a CSV or Excel file.' }).code(400);
    }

    const { id: userId } = request.auth.credentials;
    const result = await predictService.createPrediction(file, contentType, userId);

    return h.response({
      message: 'Prediction successful',
      data: result,
    }).code(200);
  } catch (error: any) {
    console.error('Prediction error:', error);
    request.log('error', error);
    return h.response({
      message: 'An error occurred during prediction.',
      error: error.message,
    }).code(500);
  }
}

export const predictController = {
  handlePrediction,
};

