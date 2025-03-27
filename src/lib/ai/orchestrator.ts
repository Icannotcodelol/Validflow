import { AnalysisDocument } from "@/types/analysis";
import { connectToDatabase } from "../mongodb";
import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema<AnalysisDocument>({
  userId: String,
  status: String,
  sections: {
    type: Map,
    of: {
      status: String,
      data: mongoose.Schema.Types.Mixed,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.models.Analysis || mongoose.model<AnalysisDocument>("Analysis", analysisSchema);

export class Orchestrator {
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (!this.initialized) {
      await connectToDatabase();
      this.initialized = true;
    }
  }

  async createAnalysis(userId: string): Promise<string> {
    await this.initialize();
    const analysis = new Analysis({
      userId,
      status: "pending",
      sections: new Map(),
    });
    await analysis.save();
    return analysis._id.toString();
  }

  async getAnalysis(analysisId: string): Promise<AnalysisDocument | null> {
    await this.initialize();
    return Analysis.findById(analysisId);
  }

  async updateAnalysisSection(
    analysisId: string,
    sectionKey: string,
    data: any,
    status: string = "completed"
  ): Promise<void> {
    await this.initialize();
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      throw new Error("Analysis not found");
    }

    if (!analysis.sections) {
      analysis.sections = new Map();
    }

    analysis.sections.set(sectionKey, { status, data });
    analysis.markModified('sections');
    await analysis.save();
  }

  async updateAnalysisStatus(
    analysisId: string,
    status: string
  ): Promise<void> {
    await this.initialize();
    await Analysis.findByIdAndUpdate(analysisId, { status });
  }
} 