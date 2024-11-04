import * as pdfjsLib from 'pdfjs-dist';

// Use the same worker configuration as pdfPreview
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface OptimizationIssues {
  hasColorContent: boolean;
  hasBackgroundElements: boolean;
  hasLargeImages: boolean;
  pageCount: number;
}

// Configuration thresholds
const OPTIMIZATION_CONFIG = {
  colorThreshold: 30,
  backgroundAreaThreshold: 50,
  largeImageThreshold: 1.0,
};

export async function analyzePdfDocument(file: File): Promise<OptimizationIssues> {
  try {
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Invalid file type. Expected PDF.');
    }

    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Empty or invalid file');
    }

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/'
    });

    loadingTask.onPassword = () => {
      throw new Error('Password protected PDFs are not supported');
    };

    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let hasColorContent = false;
    let hasBackgroundElements = false;
    let hasLargeImages = false;

    // Analyze first page as a sample
    const page = await pdf.getPage(1);
    const operatorList = await page.getOperatorList();
    
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      const fn = operatorList.fnArray[i];
      const args = operatorList.argsArray[i];

      // Check for color operations
      if (fn === pdfjsLib.OPS.setFillRGBColor || fn === pdfjsLib.OPS.setStrokeRGBColor) {
        const [r, g, b] = args;
        if (Math.abs(r - g) > OPTIMIZATION_CONFIG.colorThreshold / 255 || 
            Math.abs(g - b) > OPTIMIZATION_CONFIG.colorThreshold / 255 || 
            Math.abs(r - b) > OPTIMIZATION_CONFIG.colorThreshold / 255) {
          hasColorContent = true;
        }
      }

      // Check for background elements
      if (fn === pdfjsLib.OPS.rectangle) {
        const [x, y, width, height] = args;
        const pageArea = page.view[2] * page.view[3];
        const elementArea = width * height;
        const areaPercentage = (elementArea / pageArea) * 100;
        
        if (areaPercentage > OPTIMIZATION_CONFIG.backgroundAreaThreshold) {
          hasBackgroundElements = true;
        }
      }

      // Check for large images
      if (fn === pdfjsLib.OPS.paintImageXObject) {
        const imageData = operatorList.argsArray[i][0];
        if (imageData && 
            (imageData.width * imageData.height) > 
            (OPTIMIZATION_CONFIG.largeImageThreshold * 1000000)) {
          hasLargeImages = true;
        }
      }
    }

    return {
      hasColorContent,
      hasBackgroundElements,
      hasLargeImages,
      pageCount
    };
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze PDF document');
  }
}