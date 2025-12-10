import { Injectable, Logger } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const PdfPrinter = require('pdfmake/src/printer');

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private printer: any;

  constructor() {
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  async generatePdf(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    try {
      return new Promise((resolve, reject) => {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];

        pdfDoc.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        });

        pdfDoc.on('error', (err: any) => {
          this.logger.error('Error generating PDF stream', err);
          reject(err);
        });

        pdfDoc.end();
      });
    } catch (error) {
      this.logger.error('Failed to generate PDF', error);
      throw error;
    }
  }
}
