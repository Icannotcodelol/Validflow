import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { Analysis, AnalysisInput } from '../models/analysis';

// Validation function for AnalysisInput
function validateAnalysisInput(input: AnalysisInput): void {
  const requiredFields = [
    'userId',
    'description',
    'industry',
    'subIndustry',
    'targetCustomers',
    'pricingModel',
    'currentStage',
    'teamComposition'
  ];

  for (const field of requiredFields) {
    if (!input[field as keyof AnalysisInput]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Validation function for Analysis
function validateAnalysis(analysis: Partial<Analysis>): void {
  if (analysis.marketResearch && typeof analysis.marketResearch !== 'object') {
    throw new Error('Invalid marketResearch format');
  }
  if (analysis.analysis && typeof analysis.analysis !== 'object') {
    throw new Error('Invalid analysis format');
  }
}

export async function createAnalysis(input: AnalysisInput): Promise<Analysis> {
  try {
    validateAnalysisInput(input);
    
    const client = await clientPromise;
    const collection = client.db('valinow').collection<Analysis>('analyses');

    const now = new Date();
    const analysis: Omit<Analysis, '_id'> = {
      createdAt: now,
      updatedAt: now,
      userId: input.userId,
      marketResearch: {
        status: 'pending',
        marketSize: { total: '', addressable: '', obtainable: '', growth: '' },
        demographics: { primarySegments: [], segmentDetails: [] },
        trends: [],
        vcActivity: { activeVCs: 0, totalInvestment: '', averageDealSize: '', notableDeals: [] },
        competitors: [],
        regulations: [],
        marketDynamics: { entryBarriers: [], supplierPower: '', buyerPower: '', substitutes: [], industryRivalry: '' }
      },
      analysis: {
        executiveSummary: {
          status: 'pending',
          overview: '',
          swot: {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: []
          },
          keyMetrics: {
            marketSize: '',
            growthRate: '',
            competitionLevel: ''
          },
          recommendations: []
        },
        detailedAnalysis: {
          valueProposition: { uniqueness: '', sustainability: '', scalability: '' },
          marketFit: { needAlignment: '', timingAnalysis: '', competitiveAdvantage: '', score: 0, marketSizeScore: 0 },
          financialAnalysis: {
            revenueStreams: [],
            costStructure: { fixed: [], variable: [], unitEconomics: '' },
            projections: { year1: '', year3: '', breakeven: '' },
            score: 0
          },
          riskAssessment: {
            marketRisks: [],
            operationalRisks: [],
            financialRisks: [],
            riskScore: 0
          },
          implementationPlan: {
            phases: [],
            criticalPath: [],
            keyMetrics: [],
            feasibilityScore: 0
          }
        }
      },
      formData: {
        description: input.description,
        industry: input.industry,
        subIndustry: input.subIndustry,
        targetCustomers: input.targetCustomers,
        pricingModel: input.pricingModel,
        currentStage: input.currentStage,
        teamComposition: input.teamComposition,
        additionalInfo: input.additionalInfo
      }
    };

    const result = await collection.insertOne(analysis);
    return { ...analysis, _id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error creating analysis:', error);
    throw new Error('Failed to create analysis');
  }
}

export async function updateAnalysis(id: string, update: Partial<Analysis>): Promise<Analysis | null> {
  try {
    validateAnalysis(update);
    
    const client = await clientPromise;
    const collection = client.db('valinow').collection<Analysis>('analyses');

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...update,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (result) {
      return { ...result, _id: result._id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw new Error('Failed to update analysis');
  }
}

export async function getAnalysis(id: string): Promise<Analysis | null> {
  try {
    const client = await clientPromise;
    const collection = client.db('valinow').collection<Analysis>('analyses');

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (result) {
      return { ...result, _id: result._id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw new Error('Failed to fetch analysis');
  }
}

export async function getUserAnalyses(userId: string): Promise<Analysis[]> {
  try {
    const client = await clientPromise;
    const collection = client.db('valinow').collection<Analysis>('analyses');

    const results = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
    return results.map(result => ({ ...result, _id: result._id.toString() }));
  } catch (error) {
    console.error('Error fetching user analyses:', error);
    throw new Error('Failed to fetch user analyses');
  }
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const collection = client.db('valinow').collection<Analysis>('analyses');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw new Error('Failed to delete analysis');
  }
} 