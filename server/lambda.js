/**
 * Netlify Functions entry point.
 * Wraps the Express app with serverless-http so it can
 * run as a single Netlify Function at /.netlify/functions/api
 */
import serverless from 'serverless-http';
import { app } from './index.js';

export const handler = serverless(app);
