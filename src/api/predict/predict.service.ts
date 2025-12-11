import * as tf from '@tensorflow/tfjs'; // Correct import for Node.js
import * as path from 'path';
import * as fs from 'fs/promises';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
import pool from '../../db';
import { CreditApplication } from '../../types';

// Load preprocessing configurations
import scalerConfig from '../../../ml-model/scaler.json';
import pcaConfig from '../../../ml-model/pca.json';

let model: tf.LayersModel | null = null;

// --- Model Loading (Manual Handler) ---
async function loadModel(): Promise<tf.LayersModel> {
  if (model) return model;
  console.log('Attempting to load model manually from file system...');
  const modelJsonPath = path.resolve('./ml-model/tfjs_model/model.json');
  const weightsBinPath = path.resolve('./ml-model/tfjs_model/group1-shard1of1.bin');
  const customIOHandler: tf.io.IOHandler = {
    load: async () => {
      try {
        const modelJson = JSON.parse(await fs.readFile(modelJsonPath, 'utf-8'));
        const weights = await fs.readFile(weightsBinPath);
        return {
          modelTopology: modelJson.modelTopology,
          weightSpecs: modelJson.weightsManifest[0].weights,
          weightData: weights.buffer,
        };
      } catch (error) {
        console.error('Error during manual model file reading:', error);
        throw error;
      }
    }
  };
  model = await tf.loadLayersModel(customIOHandler);
  console.log('Model loaded successfully using manual handler.');
  return model;
}

//Data Parsing
async function parseFile(fileBuffer: Buffer, fileType: string): Promise<any[]> {
  const results: any[] = [];
  const stream = Readable.from(fileBuffer);
  if (fileType.includes('csv')) {
    return new Promise((resolve, reject) => {
      stream.pipe(csv({ separator: ',' }))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  } else if (fileType.includes('sheet') || fileType.includes('excel')) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

// Mappings for Categorical Feat
const categoryMappings = {
    job: ['admin.', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 'self-employed', 'services', 'student', 'technician', 'unemployed', 'unknown'],
    marital: ['divorced', 'married', 'single', 'unknown'],
    education: ['basic.4y', 'basic.6y', 'basic.9y', 'high.school', 'illiterate', 'professional.course', 'university.degree', 'unknown'],
    default: ['no', 'yes', 'unknown'],
    housing: ['no', 'yes', 'unknown'],
    loan: ['no', 'yes', 'unknown'],
    contact: ['cellular', 'telephone'],
    month: ['apr', 'aug', 'dec', 'jul', 'jun', 'mar', 'may', 'nov', 'oct', 'sep'],
    day_of_week: ['fri', 'mon', 'thu', 'tue', 'wed'],
    poutcome: ['failure', 'nonexistent', 'success'],
};

// Data Preprocessing 
function preprocessData(data: any[]): tf.Tensor {
    const featureOrder = [
        'age', 'job', 'marital', 'education', 'default', 'balance', 'housing', 'loan', 'contact', 'month', 'day_of_week', 'duration',
        'campaign', 'pdays', 'previous', 'poutcome', 'emp.var.rate', 'cons.price.idx', 'cons.conf.idx', 'euribor3m', 'nr.employed'
    ];
    const processedRows = data.map(row => {
        const finalFeatures: number[] = [];
        const cleanedRow: any = {};
        for (const key in row) {
            cleanedRow[key.trim()] = row[key];
        }
        featureOrder.forEach(feature => {
            let value = cleanedRow[feature];
            if (Object.keys(categoryMappings).includes(feature)) {
                const mapping = categoryMappings[feature as keyof typeof categoryMappings];
                const index = mapping.indexOf(String(value).toLowerCase());
                finalFeatures.push(index !== -1 ? index : -1);
            } else {
                if (typeof value === 'string') value = parseFloat(value.replace(',', '.'));
                finalFeatures.push(isNaN(value) ? 0 : value);
            }
        });
        return finalFeatures;
    });
    if (processedRows.length === 0 || processedRows[0].length !== featureOrder.length) {
        throw new Error(`Preprocessing failed. Expected ${featureOrder.length} features, but got ${processedRows[0]?.length || 0}.`);
    }
    const originalTensor = tf.tensor2d(processedRows);
    const scaledTensor = originalTensor.sub(tf.tensor(scalerConfig.mean)).div(tf.tensor(scalerConfig.scale));
    const pcaTensor = scaledTensor.matMul(tf.tensor(pcaConfig.components).transpose());
    const finalTensor = tf.concat([scaledTensor, pcaTensor], 1);
    originalTensor.dispose();
    scaledTensor.dispose();
    pcaTensor.dispose();
    console.log('Data preprocessing complete.', `Final tensor shape: ${finalTensor.shape}`);
    return finalTensor;
}

// --- Database Insertion (Now re-throws errors) ---
async function saveDataToDb(data: CreditApplication) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const valuePlaceholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const columnString = columns.join(',');
    const query = `INSERT INTO credit_applications (${columnString}) VALUES (${valuePlaceholders}) RETURNING id;`;
    try {
        await pool.query(query, values);
    } catch (error) {
        console.error('Database insertion failed for a row. This error will be thrown.', error);
        throw error; // Re-throw the error to be caught by the controller
    }
}

// --- Main Service Function ---
async function createPrediction(
  fileBuffer: Buffer,
  fileType: string,
  userId: string
): Promise<any[]> {
  const loadedModel = await loadModel();
  const rawData = await parseFile(fileBuffer, fileType);

  if (rawData.length === 0) throw new Error('File is empty or could not be parsed.');

  const finalTensor = preprocessData(rawData);

  if (finalTensor.shape[1] !== 25) {
      throw new Error(`Model expects 25 features, but got ${finalTensor.shape[1]}`);
  }

  const predictionTensor = loadedModel.predict(finalTensor) as tf.Tensor;
  const probabilities = await predictionTensor.data();

  const results = rawData.map((originalRow, index) => {
    const probability = probabilities[index];
    const prediction = probability > 0.5 ? 'YES' : 'NO';
    return {
      row_number: index + 1,
      original_data: originalRow,
      prediction_result: {
        probability,
        prediction,
      }
    };
  });

  // --- Save each result to the database ---
  console.log(`Saving ${results.length} prediction(s) to the database...`);
  const numericColumns = [
    'age', 'balance', 'duration', 'campaign', 'pdays', 'previous', 
    'emp_var_rate', 'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'
  ];

  for (const result of results) {
      const tempRecord: { [key: string]: any } = {};
      for (const key in result.original_data) {
          const sanitizedKey = key.trim().replace(/\./g, '_');

          // Skip the target variable 'y' from being saved
          if (sanitizedKey === 'y') {
              continue;
          }
          
          let value = result.original_data[key];

          // For numeric columns, replace comma with dot for database compatibility
          if (numericColumns.includes(sanitizedKey) && typeof value === 'string') {
              value = parseFloat(value.replace(',', '.'));
          }
          
          if (sanitizedKey === 'default') {
            tempRecord['has_credit_in_default'] = value;
          } else {
            tempRecord[sanitizedKey] = value;
          }
      }
      tempRecord.prediction_result = result.prediction_result.prediction;
      tempRecord.prediction_probability = result.prediction_result.probability;
      tempRecord.user_id = userId;
      tempRecord.created_at = new Date();
      tempRecord.updated_at = new Date();

      const recordToSave = tempRecord as CreditApplication;
      // The await here ensures that if a row fails, the loop stops and the error propagates up.
      await saveDataToDb(recordToSave);
  }
  console.log('Database saving process complete.');


  finalTensor.dispose();
  predictionTensor.dispose();

  return results;
}

export const predictService = {
  createPrediction,
};

export { loadModel };