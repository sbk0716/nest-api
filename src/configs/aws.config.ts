export const AwsConfig = {
  REGION: process.env.REGION || 'ap-northeast-1',
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'gw-report-export',
};
