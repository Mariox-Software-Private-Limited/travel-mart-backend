import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { CustomError } from '../helpers/exceptions';
@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}
  private readonly secretKey = this.configService.get('auth.secret');

  //This function is used for encrypting data.
  encrypt(data: any): string {
    try {
      const iv = CryptoJS.lib.WordArray.random(16); // Random bytes for IV
      const cipher = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        CryptoJS.enc.Utf8.parse(this.secretKey),
        {
          iv: iv,
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.Pkcs7,
        },
      );

      return `${iv.toString()}:${cipher.toString()}`;
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  // This function is used for decrypting data.
  decrypt(encryptedData: string) {
    let ivStr;
    let cipherText;

    // Check if encryptedData is defined and not null explicitly
    if (encryptedData !== undefined && encryptedData !== null) {
      // Use optional chaining after nullish coalescing to avoid potential TypeError
      [ivStr, cipherText] =
        encryptedData.replace(/^"(.*)"$/, '$1').split(':') ?? [];
    }

    try {
      const iv = CryptoJS.enc.Hex.parse(ivStr);

      const decrypted = CryptoJS.AES.decrypt(
        cipherText,
        CryptoJS.enc.Utf8.parse(this.secretKey),
        {
          iv: iv,
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.Pkcs7,
        },
      );

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }
}
