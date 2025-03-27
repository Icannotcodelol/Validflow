import { Document } from "mongoose";

export interface AnalysisSection {
  status: string;
  data: any;
}

export interface AnalysisDocument extends Document {
  userId: string;
  status: string;
  sections: Map<string, AnalysisSection>;
  createdAt: Date;
  updatedAt: Date;
} 