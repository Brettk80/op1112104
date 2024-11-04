import { toast } from 'sonner';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { ColumnMapping } from './ColumnMapper';

export interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords?: number;
  processedRecords?: number;
  error?: string;
  mapping?: ColumnMapping;
}

export interface FaxRecipient {
  faxNumber: string;
  toHeader?: string;
}

class FaxListProcessor {
  private static instance: FaxListProcessor;
  private jobs: Map<string, ProcessingJob> = new Map();
  private subscribers: Set<(jobs: ProcessingJob[]) => void> = new Set();

  private constructor() {}

  static getInstance(): FaxListProcessor {
    if (!this.instance) {
      this.instance = new FaxListProcessor();
    }
    return this.instance;
  }

  subscribe(callback: (jobs: ProcessingJob[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers() {
    const jobs = Array.from(this.jobs.values());
    this.subscribers.forEach(callback => callback(jobs));
  }

  private async processChunk(
    chunk: any[],
    mapping: ColumnMapping
  ): Promise<FaxRecipient[]> {
    return chunk.map(row => ({
      faxNumber: row[mapping.faxNumber],
      toHeader: mapping.toHeader ? row[mapping.toHeader] : undefined
    }));
  }

  async processFile(file: File, mapping: ColumnMapping): Promise<string> {
    const jobId = Math.random().toString(36).substr(2, 9);
    const job: ProcessingJob = {
      id: jobId,
      fileName: file.name,
      status: 'queued',
      progress: 0,
      mapping
    };

    this.jobs.set(jobId, job);
    this.notifySubscribers();

    try {
      job.status = 'processing';
      this.notifySubscribers();

      const extension = file.name.split('.').pop()?.toLowerCase();
      let records: any[] = [];

      if (extension === 'csv' || extension === 'txt') {
        records = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
          });
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        records = XLSX.utils.sheet_to_json(firstSheet);
      }

      job.totalRecords = records.length;
      job.processedRecords = 0;

      const chunkSize = 1000;
      const chunks = Array(Math.ceil(records.length / chunkSize))
        .fill(null)
        .map((_, index) => records.slice(index * chunkSize, (index + 1) * chunkSize));

      const recipients: FaxRecipient[] = [];

      for (const chunk of chunks) {
        const processedChunk = await this.processChunk(chunk, mapping);
        recipients.push(...processedChunk);
        
        job.processedRecords += chunk.length;
        job.progress = Math.floor((job.processedRecords / job.totalRecords) * 100);
        this.notifySubscribers();

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      job.status = 'completed';
      job.progress = 100;
      this.notifySubscribers();
      
      toast.success(`Successfully processed ${file.name}`);
      return jobId;

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifySubscribers();
      
      toast.error(`Failed to process ${file.name}`);
      throw error;
    }
  }

  getJob(jobId: string): ProcessingJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): ProcessingJob[] {
    return Array.from(this.jobs.values());
  }

  removeJob(jobId: string) {
    this.jobs.delete(jobId);
    this.notifySubscribers();
  }
}

export default FaxListProcessor;