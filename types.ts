export enum ProtocolStep {
  QRNG = 'QRNG',
  KYBER = 'KYBER',
  DILITHIUM = 'DILITHIUM',
  CHAT = 'CHAT'
}

export enum PipelineStep {
  IDLE = 'IDLE',
  QRNG = 'QRNG',
  KYBER = 'KYBER',
  DILITHIUM = 'DILITHIUM',
  SENDING = 'SENDING',
  RECEIVING = 'RECEIVING'
}

export interface EducationalContent {
  title: string;
  role: string;
  positive: string[];
  negative: string[];
  summary: string;
}

export enum SimulationState {
  IDLE,
  PROCESSING,
  COMPLETE
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'System' | 'Alice' | 'Bob' | 'Eve';
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}