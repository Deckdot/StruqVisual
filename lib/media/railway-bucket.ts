import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type RailwayBucketConfig = {
  accessKeyId: string;
  bucketName: string;
  endpoint: string;
  region: string;
  secretAccessKey: string;
};

function readBucketConfig(): RailwayBucketConfig {
  const bucketName = process.env.RAILWAY_BUCKET_NAME;
  const endpoint = process.env.RAILWAY_BUCKET_ENDPOINT;
  const region = process.env.RAILWAY_BUCKET_REGION;
  const accessKeyId = process.env.RAILWAY_BUCKET_ACCESS_KEY_ID;
  const secretAccessKey = process.env.RAILWAY_BUCKET_SECRET_ACCESS_KEY;

  if (!bucketName || !endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Railway Bucket env ontbreekt. Verwacht: RAILWAY_BUCKET_NAME, RAILWAY_BUCKET_ENDPOINT, RAILWAY_BUCKET_REGION, RAILWAY_BUCKET_ACCESS_KEY_ID, RAILWAY_BUCKET_SECRET_ACCESS_KEY.'
    );
  }

  return { accessKeyId, bucketName, endpoint, region, secretAccessKey };
}

let client: S3Client | null = null;

function getBucketClient(): S3Client {
  if (client) return client;
  const config = readBucketConfig();
  client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: false,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return client;
}

export function canonPathToBucketKey(canonPath: string): string {
  return canonPath.replace(/^\/+/, '');
}

export async function getPresignedMediaUrl(key: string, expiresIn = 3600): Promise<string> {
  const config = readBucketConfig();
  return getSignedUrl(
    getBucketClient(),
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    }),
    { expiresIn }
  );
}

export async function headBucketObject(key: string) {
  const config = readBucketConfig();
  try {
    return await getBucketClient().send(
      new HeadObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      })
    );
  } catch (error) {
    const code = (error as { name?: string }).name;
    if (code === 'NotFound' || code === 'NoSuchKey' || code === 'UnknownError') return null;
    throw error;
  }
}

export async function putBucketObject(opts: {
  body: Uint8Array;
  cacheControl?: string;
  contentType: string;
  key: string;
}) {
  const config = readBucketConfig();
  return getBucketClient().send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl,
    })
  );
}
