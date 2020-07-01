const config = {
  NODE_ENV: process.env.NODE_ENV,
  APP_ID: process.env.APP_ID || process.env.PARSE_SERVER_APPLICATION_ID,
  JS_KEY: process.env.JS_KEY || process.env.PARSE_SERVER_JAVASCRIPT_KEY,
  SERVER_URL: process.env.SERVER_URL || process.env.PARSE_PUBLIC_SERVER_URL || process.env.PARSE_SERVER_URL,
  LOCAL_FILES_URL: process.env.LOCAL_FILES_URL,
  PRODUCTION_FILES_URL: process.env.PRODUCTION_FILES_URL || process.env.PARSE_SERVER_S3_BASE_URL,
};

export default config;
