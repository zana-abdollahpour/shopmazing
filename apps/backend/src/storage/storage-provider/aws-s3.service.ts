import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { StorageService } from './storage.service.abstract.js';

@Injectable()
export class AwsS3Service implements StorageService {
  private readonly awsS3Client: S3Client;

  constructor(
    private readonly region: string,
    private readonly bucket: string,
  ) {
    this.awsS3Client = new S3Client({ region: this.region });
  }

  async upload(productId: number, fileBuffer: Buffer): Promise<void> {
    await this.awsS3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${productId}.jpg`,
        Body: fileBuffer,
      }),
    );
  }

  async fileExists(fileName: string): Promise<boolean> {
    const { Body } = await this.awsS3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      }),
    );
    return !!Body;
  }
}
