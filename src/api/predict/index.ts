import * as Hapi from '@hapi/hapi';
import { predictController } from './predict.controller';

const predictRoutes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/predict',
    options: {
      auth: 'jwt-auth', 
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: {
            output: 'stream'
        },
        maxBytes: 10 * 1024 * 1024, // 10MB limit
      },
      handler: predictController.handlePrediction,
      description: 'Upload a file for prediction',
      tags: ['api', 'predict'],
      notes: 'Upload a CSV or Excel file to get a credit score prediction. The file should be sent as multipart/form-data with the key "file".',
    },
  },
  {
    method: 'GET',
    path: '/api/predict',
    options: {
      auth: 'jwt-auth',
      handler: predictController.handleGetPredictions,
      description: 'Get prediction history for the authenticated user',
      tags: ['api', 'predict'],
      notes: 'Returns a list of all predictions made by the currently authenticated user.',
    },
  },
];

export default predictRoutes;
