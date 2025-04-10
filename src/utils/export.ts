import {
  AnalysisDocument,
  BaseSectionResponse,
  MarketSizeGrowth,
  TargetUsers,
  Competition,
  UnitEconomics,
  MarketingChannels,
  GoToMarketPlan,
  VCSentiment,
  CriticalThoughtQuestions,
  ReportSummary,
  ExecutiveSummary as ExecutiveSummaryType,
} from "@/lib/ai/models";
import { jsPDF, TextOptionsLight } from "jspdf";
import autoTable from 'jspdf-autotable';

// Helper type for jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}

// --- PDF Generation Helpers ---

const PAGE_MARGIN = 20;
const CONTENT_WIDTH = 170; // Page width (210) - 2 * PAGE_MARGIN
let yPos = 0; // Track current Y position on the page
const LINE_HEIGHT = 7; // Approx line height for font size 12
const SECTION_SPACING = 15;
const SUBSECTION_SPACING = 8;
const LIST_INDENT = 5;

// Type guard to check if a section is valid and complete
function isSectionComplete(section: any): section is BaseSectionResponse {
  return section && typeof section === 'object' && section.status === 'completed';
}

function checkAddPage(doc: jsPDFWithAutoTable, currentY: number, requiredHeight = LINE_HEIGHT * 3): number {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + requiredHeight > pageHeight - PAGE_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN * 2; // Start Y pos on new page
  }
  return currentY;
}

function addSectionTitle(doc: jsPDFWithAutoTable, title: string): number {
  yPos = checkAddPage(doc, yPos, LINE_HEIGHT * 2 + SECTION_SPACING);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(title, PAGE_MARGIN, yPos);
  doc.setFont(undefined, 'normal');
  yPos += LINE_HEIGHT * 1.5;
  return yPos;
}

function addSubHeading(doc: jsPDFWithAutoTable, title: string): number {
   yPos = checkAddPage(doc, yPos, LINE_HEIGHT * 1.5 + SUBSECTION_SPACING);
   doc.setFontSize(13);
   doc.setFont(undefined, 'bold');
   doc.text(title, PAGE_MARGIN, yPos);
   doc.setFont(undefined, 'normal');
   yPos += LINE_HEIGHT * 1.2;
   return yPos;
}

function addParagraph(doc: jsPDFWithAutoTable, text: string | null | undefined, indent = 0): number {
  const safeText = text ?? '';
  if (!safeText) return yPos;
  yPos = checkAddPage(doc, yPos);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(safeText, CONTENT_WIDTH - indent);
  doc.text(lines, PAGE_MARGIN + indent, yPos);
  yPos += lines.length * LINE_HEIGHT * 0.85;
  yPos += SUBSECTION_SPACING / 2;
  return yPos;
}

function addList(doc: jsPDFWithAutoTable, items: readonly string[] | undefined | null, indent = LIST_INDENT): number {
  const safeItems = items ?? [];
  if (safeItems.length === 0) return yPos;
  doc.setFontSize(11);
  safeItems.forEach(item => {
    yPos = checkAddPage(doc, yPos);
    const bulletPoint = `\\u2022 ${item ?? ''}`;
    const lines = doc.splitTextToSize(bulletPoint, CONTENT_WIDTH - indent);
    doc.text(lines, PAGE_MARGIN + indent, yPos);
    yPos += lines.length * LINE_HEIGHT * 0.85;
  });
   yPos += SUBSECTION_SPACING / 2;
  return yPos;
}

function addKeyValue(doc: jsPDFWithAutoTable, key: string, value: string | number | null | undefined, indent = 0): number {
   const valueText = String(value ?? '');
   if (valueText === '') return yPos;

   yPos = checkAddPage(doc, yPos);
   doc.setFontSize(11);
   doc.setFont(undefined, 'bold');
   doc.text(`${key}:`, PAGE_MARGIN + indent, yPos);
   doc.setFont(undefined, 'normal');

   const keyWidth = doc.getTextWidth(`${key}: `);
   const remainingWidth = CONTENT_WIDTH - indent - keyWidth;
   const splitWidth = remainingWidth > 10 ? remainingWidth : CONTENT_WIDTH - indent;
   const lines = doc.splitTextToSize(valueText, splitWidth);

   doc.text(lines, PAGE_MARGIN + indent + keyWidth, yPos);
   yPos += lines.length * LINE_HEIGHT * 0.85;
   yPos += SUBSECTION_SPACING / 2;
   return yPos;
}


function addTable(doc: jsPDFWithAutoTable, head: string[][], body: (string | number | null | undefined)[][]): number {
  yPos = checkAddPage(doc, yPos, 20); // Estimate table height
  const safeBody = body.map(row => row.map(cell => String(cell ?? ''))); // Ensure all cells are strings

  autoTable(doc, {
    head: head,
    body: safeBody,
    startY: yPos,
    headStyles: { fillColor: [52, 73, 94], textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 9, cellPadding: 1.5 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    theme: 'grid',
    didDrawPage: (data) => {
       yPos = data.cursor?.y ?? yPos;
    }
  });
  yPos = doc.lastAutoTable?.finalY ?? yPos + 20;
  yPos += SECTION_SPACING / 2;
  return yPos;
}

// --- Main PDF Export Function ---

export async function exportToPDF(analysis: AnalysisDocument) {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  yPos = PAGE_MARGIN; // Reset Y position

  // --- Report Title ---
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text("Business Analysis Report", doc.internal.pageSize.width / 2, yPos, { align: 'center' });
  doc.setFont(undefined, 'normal');
  yPos += LINE_HEIGHT * 2;
  addKeyValue(doc, "User Input", analysis.userInput?.description ?? 'N/A');
  yPos += SECTION_SPACING;


  // --- Executive Summary ---
  const execSummarySection = analysis.sections.executiveSummary;
  if (isSectionComplete(execSummarySection)) {
    const execSummaryData = execSummarySection as ExecutiveSummaryType;
    addSectionTitle(doc, "Executive Summary");
    addKeyValue(doc, "Viability Score", `${execSummaryData.score ?? 'N/A'}/100`);
    addParagraph(doc, execSummaryData.summary);
    if (execSummaryData.keyHighlights && execSummaryData.keyHighlights.length > 0) {
       addSubHeading(doc, "Key Highlights");
       addList(doc, execSummaryData.keyHighlights);
    }
    addKeyValue(doc, "Recommendation", execSummaryData.recommendation);
    yPos += SECTION_SPACING;
  }

  // --- Market Size & Growth ---
  const marketSizeSection = analysis.sections.marketSizeGrowth;
  if (isSectionComplete(marketSizeSection)) {
    const marketSizeData = marketSizeSection as MarketSizeGrowth;
    addSectionTitle(doc, "Market Size & Growth");

    if (marketSizeData.totalAddressableMarket) {
      addSubHeading(doc, "Total Addressable Market (TAM)");
      addKeyValue(doc, "Size", marketSizeData.totalAddressableMarket.size);
      addKeyValue(doc, "Description", marketSizeData.totalAddressableMarket.description);
      addKeyValue(doc, "Methodology", marketSizeData.totalAddressableMarket.methodology);
      yPos += SUBSECTION_SPACING;
    }
    if (marketSizeData.serviceableAddressableMarket) {
      addSubHeading(doc, "Serviceable Addressable Market (SAM)");
      addKeyValue(doc, "Size", marketSizeData.serviceableAddressableMarket.size);
      addKeyValue(doc, "Description", marketSizeData.serviceableAddressableMarket.description);
      addKeyValue(doc, "Limitations", marketSizeData.serviceableAddressableMarket.limitations?.join(', ') ?? '');
      yPos += SUBSECTION_SPACING;
    }
    if (marketSizeData.serviceableObtainableMarket) {
      addSubHeading(doc, "Serviceable Obtainable Market (SOM)");
      addKeyValue(doc, "Size", marketSizeData.serviceableObtainableMarket.size);
      addKeyValue(doc, "Description", marketSizeData.serviceableObtainableMarket.description);
      addKeyValue(doc, "Timeframe", marketSizeData.serviceableObtainableMarket.timeframe);
      addKeyValue(doc, "Assumptions", marketSizeData.serviceableObtainableMarket.assumptions?.join(', ') ?? '');
      yPos += SUBSECTION_SPACING;
    }
    if (marketSizeData.growthRate) {
      addSubHeading(doc, "Growth Rate");
      addKeyValue(doc, "Current", marketSizeData.growthRate.current);
      addKeyValue(doc, "Projected", marketSizeData.growthRate.projected);
      addKeyValue(doc, "Factors", marketSizeData.growthRate.factors?.join(', ') ?? '');
      yPos += SUBSECTION_SPACING;
    }
     if (marketSizeData.marketTrends && marketSizeData.marketTrends.length > 0) {
        addSubHeading(doc, "Market Trends");
        addTable(doc,
            [['Trend', 'Description', 'Impact', 'Timeframe']],
            marketSizeData.marketTrends.map(t => [t?.trend, t?.description, t?.impact, t?.timeframe])
        );
    }
     if (marketSizeData.marketDrivers && marketSizeData.marketDrivers.length > 0) {
        addSubHeading(doc, "Market Drivers");
        addTable(doc,
            [['Driver', 'Description', 'Impact']],
            marketSizeData.marketDrivers.map(d => [d?.driver, d?.description, d?.impact])
        );
    }
     if (marketSizeData.marketChallenges && marketSizeData.marketChallenges.length > 0) {
        addSubHeading(doc, "Market Challenges");
        addTable(doc,
            [['Challenge', 'Description', 'Impact', 'Mitigation']],
            marketSizeData.marketChallenges.map(c => [c?.challenge, c?.description, c?.impact, c?.mitigation])
        );
    }
    yPos += SECTION_SPACING;
  }

  // --- Target Users ---
  const targetUsersSection = analysis.sections.targetUsers;
   if (isSectionComplete(targetUsersSection)) {
    const targetUsersData = targetUsersSection as TargetUsers;
    addSectionTitle(doc, "Target Users Analysis");
    if (targetUsersData.primaryUserPersonas && targetUsersData.primaryUserPersonas.length > 0) {
        addSubHeading(doc, "Primary User Personas");
        targetUsersData.primaryUserPersonas.forEach(persona => {
            yPos = checkAddPage(doc, yPos);
    doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(persona?.name ?? 'Unnamed Persona', PAGE_MARGIN, yPos);
            doc.setFont(undefined, 'normal');
            yPos += LINE_HEIGHT;
            addParagraph(doc, persona?.description);
            addKeyValue(doc, "Pain Points", persona?.painPoints?.join(', ') ?? '', LIST_INDENT);
            addKeyValue(doc, "Needs", persona?.needs?.join(', ') ?? '', LIST_INDENT);
            addKeyValue(doc, "Behaviors", persona?.behaviors?.join(', ') ?? '', LIST_INDENT);
            yPos += SUBSECTION_SPACING;
        });
    }
     if (targetUsersData.userSegments && targetUsersData.userSegments.length > 0) {
        addSubHeading(doc, "User Segments");
         addTable(doc,
             [['Segment', 'Size', 'Characteristics']],
             targetUsersData.userSegments.map(s => [s?.segment, s?.size, s?.characteristics?.join(', ') ?? ''])
         );
     }
     addSubHeading(doc, "User Strategy");
     addKeyValue(doc, "Acquisition Strategy", targetUsersData.userAcquisitionStrategy);
     addKeyValue(doc, "Retention Strategy", targetUsersData.userRetentionStrategy);
     yPos += SECTION_SPACING;
  }


  // --- Competition Analysis ---
  const competitionSection = analysis.sections.competition;
  if (isSectionComplete(competitionSection)) {
    const competitionData = competitionSection as Competition;
    addSectionTitle(doc, "Competition Analysis");
    if (competitionData.directCompetitors && competitionData.directCompetitors.length > 0) {
      addSubHeading(doc, "Direct Competitors");
      addTable(doc,
          [['Name', 'Description', 'Strengths', 'Weaknesses', 'Market Share']],
          competitionData.directCompetitors.map(c => [c?.name, c?.description, c?.strengths?.join(', ') ?? '', c?.weaknesses?.join(', ') ?? '', c?.marketShare])
      );
    }
    if (competitionData.indirectCompetitors && competitionData.indirectCompetitors.length > 0) {
       addSubHeading(doc, "Indirect Competitors");
       addTable(doc,
           [['Name', 'Description', 'Threat Level']],
           competitionData.indirectCompetitors.map(c => [c?.name, c?.description, c?.threatLevel])
       );
    }
     if (competitionData.competitiveAdvantages && competitionData.competitiveAdvantages.length > 0) {
        addSubHeading(doc, "Competitive Advantages");
        addList(doc, competitionData.competitiveAdvantages);
    }
     if (competitionData.marketGaps && competitionData.marketGaps.length > 0) {
        addSubHeading(doc, "Market Gaps");
        addList(doc, competitionData.marketGaps);
    }
    yPos += SECTION_SPACING;
  }

  // --- Unit Economics ---
  const unitEconomicsSection = analysis.sections.unitEconomics;
  if (isSectionComplete(unitEconomicsSection)) {
    const unitEconomicsData = unitEconomicsSection as UnitEconomics;
    addSectionTitle(doc, "Unit Economics");

    if (unitEconomicsData.pricing) {
      addSubHeading(doc, "Pricing");
      addKeyValue(doc, "Model", unitEconomicsData.pricing.model);
      addKeyValue(doc, "Strategy", unitEconomicsData.pricing.strategy);
       if (unitEconomicsData.pricing.tiers && unitEconomicsData.pricing.tiers.length > 0) {
          addTable(doc,
              [['Tier Name', 'Price', 'Features']],
              unitEconomicsData.pricing.tiers.map(t => [t?.name, t?.price, t?.features?.join(', ') ?? ''])
          );
       }
    }

     if (unitEconomicsData.costs) {
        addSubHeading(doc, "Cost Structure");
        if (unitEconomicsData.costs.fixed && unitEconomicsData.costs.fixed.length > 0) {
            addKeyValue(doc, "Fixed Costs", "");
            addTable(doc,
                [['Name', 'Amount', 'Frequency']],
                unitEconomicsData.costs.fixed.map(c => [c?.name, c?.amount, c?.frequency])
            );
        }
         if (unitEconomicsData.costs.variable && unitEconomicsData.costs.variable.length > 0) {
            addKeyValue(doc, "Variable Costs", "");
            addTable(doc,
                [['Name', 'Amount', 'Unit']],
                unitEconomicsData.costs.variable.map(c => [c?.name, c?.amount, c?.unit])
            );
         }
     }

    if (unitEconomicsData.metrics) {
      addSubHeading(doc, "Key Metrics");
      addKeyValue(doc, "Customer Acquisition Cost (CAC)", unitEconomicsData.metrics.cac);
      addKeyValue(doc, "Lifetime Value (LTV)", unitEconomicsData.metrics.ltv);
      addKeyValue(doc, "Contribution Margin", unitEconomicsData.metrics.margin);
      addKeyValue(doc, "Payback Period", unitEconomicsData.metrics.paybackPeriod);
      addKeyValue(doc, "Break-Even Point", unitEconomicsData.metrics.breakEvenPoint);
    }

     if (unitEconomicsData.projections && unitEconomicsData.projections.length > 0) {
        addSubHeading(doc, "Financial Projections");
        addTable(doc,
            [['Period', 'Revenue', 'Costs', 'Profit']],
            unitEconomicsData.projections.map(p => [p?.period, p?.revenue, p?.costs, p?.profit])
        );
     }
     addKeyValue(doc, "Analysis", unitEconomicsData.analysis);
     yPos += SECTION_SPACING;
  }


  // --- Marketing Channels ---
  const marketingSection = analysis.sections.marketingChannels;
  if (isSectionComplete(marketingSection)) {
    const marketingData = marketingSection as MarketingChannels;
    addSectionTitle(doc, "Marketing Channel Strategy");
    if (marketingData.channels && marketingData.channels.length > 0) {
       addSubHeading(doc, "Channel Strategies");
       marketingData.channels.forEach(channel => {
           yPos = checkAddPage(doc, yPos);
      doc.setFontSize(12);
           doc.setFont(undefined, 'bold');
           doc.text(channel?.name ?? 'Unnamed Channel', PAGE_MARGIN, yPos);
           doc.setFont(undefined, 'normal');
           yPos += LINE_HEIGHT;
           addKeyValue(doc, "Description", channel?.description, LIST_INDENT);
           addKeyValue(doc, "Type", channel?.type, LIST_INDENT);
           addKeyValue(doc, "Strategy", channel?.strategy, LIST_INDENT);
           addKeyValue(doc, "Timeline", channel?.timeline, LIST_INDENT);
           addKeyValue(doc, "Budget", channel?.budget, LIST_INDENT);
           if (channel?.metrics) {
                addKeyValue(doc, "Metrics", "", LIST_INDENT);
                addKeyValue(doc, "Reach", channel.metrics.reach, LIST_INDENT * 2);
                addKeyValue(doc, "Cost", channel.metrics.cost, LIST_INDENT * 2);
                addKeyValue(doc, "ROI", channel.metrics.roi, LIST_INDENT * 2);
                addKeyValue(doc, "Conversion Rate", channel.metrics.conversionRate, LIST_INDENT * 2);
           }
            addKeyValue(doc, "KPIs", channel?.kpis?.join(', ') ?? '', LIST_INDENT);
            yPos += SUBSECTION_SPACING;
       });
    }
    if (marketingData.budget) {
       addSubHeading(doc, "Budget Breakdown");
       addKeyValue(doc, "Total Budget", marketingData.budget.total);
       addKeyValue(doc, "Timeline", marketingData.budget.timeline);
       if (marketingData.budget.breakdown && marketingData.budget.breakdown.length > 0) {
            addTable(doc,
                [['Category', 'Amount', 'Percentage']],
                marketingData.budget.breakdown.map(b => [b?.category, b?.amount, b?.percentage])
            );
       }
    }
     if (marketingData.recommendations && marketingData.recommendations.length > 0) {
        addSubHeading(doc, "Recommendations");
        addList(doc, marketingData.recommendations);
    }
    addSubHeading(doc, "Overall Analysis");
    addParagraph(doc, marketingData.analysis);
    yPos += SECTION_SPACING;
  }

  // --- Go-to-Market Plan ---
  const gtmSection = analysis.sections.goToMarketPlan;
  if (isSectionComplete(gtmSection)) {
     const gtmData = gtmSection as GoToMarketPlan;
     addSectionTitle(doc, "Go-to-Market Plan");
     if (gtmData.launchStrategy?.phases && gtmData.launchStrategy.phases.length > 0) {
         addSubHeading(doc, "Launch Strategy");
         gtmData.launchStrategy.phases.forEach(phase => {
             yPos = checkAddPage(doc, yPos);
             doc.setFontSize(12);
             doc.setFont(undefined, 'bold');
             doc.text(phase?.phase ?? 'Unnamed Phase', PAGE_MARGIN, yPos);
             doc.setFont(undefined, 'normal');
             yPos += LINE_HEIGHT;
             addKeyValue(doc, "Timeline", phase?.timeline, LIST_INDENT);
             addKeyValue(doc, "Activities", "", LIST_INDENT);
             addList(doc, phase?.activities, LIST_INDENT * 2);
             addKeyValue(doc, "Metrics", "", LIST_INDENT);
             addList(doc, phase?.metrics, LIST_INDENT * 2);
             yPos += SUBSECTION_SPACING;
         });
     }
      if (gtmData.keyPartnerships && gtmData.keyPartnerships.length > 0) {
         addSubHeading(doc, "Key Partnerships");
         addTable(doc,
             [['Partner', 'Type', 'Value Proposition']],
             gtmData.keyPartnerships.map(p => [p?.partner, p?.type, p?.value])
         );
      }
      if (gtmData.resourceRequirements) {
          addSubHeading(doc, "Resource Requirements");
          addKeyValue(doc, "Team", gtmData.resourceRequirements.team?.join(', ') ?? '');
          addKeyValue(doc, "Budget", gtmData.resourceRequirements.budget);
          addKeyValue(doc, "Technology Stack", gtmData.resourceRequirements.technology?.join(', ') ?? '');
      }
      yPos += SECTION_SPACING;
  }

  // --- VC Sentiment Analysis ---
  const vcSentimentSection = analysis.sections.vcSentiment;
  if (isSectionComplete(vcSentimentSection)) {
    const vcSentimentData = vcSentimentSection as VCSentiment;
    addSectionTitle(doc, "VC Sentiment Analysis");

    if (vcSentimentData.overview) {
      addSubHeading(doc, "Investment Overview");
      addKeyValue(doc, "Overall Score", `${vcSentimentData.overview.score ?? 'N/A'}/100`);
      addKeyValue(doc, "Confidence", `${vcSentimentData.overview.confidence ?? 'N/A'}%`);
      addKeyValue(doc, "Verdict", vcSentimentData.overview.verdict);
      addParagraph(doc, vcSentimentData.overview.summary);
      yPos += SUBSECTION_SPACING;
    }

    if (vcSentimentData.investmentAttractiveness) {
       addSubHeading(doc, "Investment Attractiveness");
       addKeyValue(doc, "Score", `${vcSentimentData.investmentAttractiveness.score ?? 'N/A'}/100`);
       addKeyValue(doc, "Confidence", `${vcSentimentData.investmentAttractiveness.confidence ?? 'N/A'}%`);
       addKeyValue(doc, "Strengths", "");
       addList(doc, vcSentimentData.investmentAttractiveness.strengths, LIST_INDENT);
       addKeyValue(doc, "Weaknesses", "");
       addList(doc, vcSentimentData.investmentAttractiveness.weaknesses, LIST_INDENT);
       addKeyValue(doc, "Opportunities", "");
       addList(doc, vcSentimentData.investmentAttractiveness.opportunities, LIST_INDENT);
       addKeyValue(doc, "Threats", "");
       addList(doc, vcSentimentData.investmentAttractiveness.threats, LIST_INDENT);
       yPos += SUBSECTION_SPACING;
    }

     if (vcSentimentData.marketActivity) {
        addSubHeading(doc, "Market Activity");
        if (vcSentimentData.marketActivity.investmentVolume) {
            addKeyValue(doc, "Total Investment Volume", vcSentimentData.marketActivity.investmentVolume.total);
            addKeyValue(doc, "Timeframe", vcSentimentData.marketActivity.investmentVolume.timeframe);
            addKeyValue(doc, "Trend", vcSentimentData.marketActivity.investmentVolume.trend);
            addKeyValue(doc, "Growth", vcSentimentData.marketActivity.investmentVolume.growth);
            addParagraph(doc, vcSentimentData.marketActivity.investmentVolume.analysis);
            yPos += SUBSECTION_SPACING;
        }
         if (vcSentimentData.marketActivity.notableTransactions && vcSentimentData.marketActivity.notableTransactions.length > 0) {
             addKeyValue(doc, "Notable Transactions", "");
             addTable(doc,
                 [['Date', 'Company', 'Round', 'Amount', 'Investors']],
                 vcSentimentData.marketActivity.notableTransactions.map(t => [t?.date, t?.company, t?.round, t?.amount, t?.investors?.join(', ') ?? ''])
             );
         }
          if (vcSentimentData.marketActivity.comparableExits && vcSentimentData.marketActivity.comparableExits.length > 0) {
             addKeyValue(doc, "Comparable Exits", "");
             addTable(doc,
                 [['Company', 'Type', 'Value', 'Date', 'Details']],
                 vcSentimentData.marketActivity.comparableExits.map(e => [e?.company, e?.type, e?.value, e?.date, e?.details])
             );
          }
     }

     if (vcSentimentData.marketTrends) {
        addSubHeading(doc, "Market Trends");
        addParagraph(doc, vcSentimentData.marketTrends.overview);
        if (vcSentimentData.marketTrends.trends && vcSentimentData.marketTrends.trends.length > 0) {
             addTable(doc,
                 [['Trend Name', 'Impact', 'Timeline']],
                 vcSentimentData.marketTrends.trends.map(t => [t?.name, t?.impact, t?.timeline])
             );
        }
        if (vcSentimentData.marketTrends.investorSentiment) {
            addKeyValue(doc, "Investor Sentiment", vcSentimentData.marketTrends.investorSentiment.overall);
            addKeyValue(doc, "Key Factors", vcSentimentData.marketTrends.investorSentiment.keyFactors?.join(', ') ?? '', LIST_INDENT);
            addKeyValue(doc, "Concerns", vcSentimentData.marketTrends.investorSentiment.concerns?.join(', ') ?? '', LIST_INDENT);
            addKeyValue(doc, "Outlook", vcSentimentData.marketTrends.investorSentiment.outlook, LIST_INDENT);
            yPos += SUBSECTION_SPACING;
        }
     }

     if (vcSentimentData.fundingStrategy) {
         addSubHeading(doc, "Funding Strategy");
         if (vcSentimentData.fundingStrategy.recommendedRound) {
             addKeyValue(doc, "Recommended Round", vcSentimentData.fundingStrategy.recommendedRound.type);
             addKeyValue(doc, "Target Amount", vcSentimentData.fundingStrategy.recommendedRound.targetAmount, LIST_INDENT);
             addKeyValue(doc, "Timing", vcSentimentData.fundingStrategy.recommendedRound.timing, LIST_INDENT);
             if (vcSentimentData.fundingStrategy.recommendedRound.valuation) {
                 addKeyValue(doc, "Valuation Range", vcSentimentData.fundingStrategy.recommendedRound.valuation.range, LIST_INDENT);
                 addKeyValue(doc, "Valuation Basis", vcSentimentData.fundingStrategy.recommendedRound.valuation.basis?.join(', ') ?? '', LIST_INDENT);
             }
             yPos += SUBSECTION_SPACING;
         }
          if (vcSentimentData.fundingStrategy.useOfFunds && vcSentimentData.fundingStrategy.useOfFunds.length > 0) {
             addKeyValue(doc, "Use of Funds", "");
             addTable(doc,
                 [['Category', 'Allocation', 'Details']],
                 vcSentimentData.fundingStrategy.useOfFunds.map(u => [u?.category, u?.allocation, u?.details])
             );
          }
           if (vcSentimentData.fundingStrategy.targetInvestors && vcSentimentData.fundingStrategy.targetInvestors.length > 0) {
              addKeyValue(doc, "Target Investors", "");
              addTable(doc,
                  [['Type', 'Focus Areas', 'Examples']],
                  vcSentimentData.fundingStrategy.targetInvestors.map(i => [i?.type, i?.focus?.join(', ') ?? '', i?.examples?.join(', ') ?? ''])
              );
           }
            if (vcSentimentData.fundingStrategy.milestones && vcSentimentData.fundingStrategy.milestones.length > 0) {
               addKeyValue(doc, "Key Milestones", "");
               addTable(doc,
                   [['Milestone', 'Timeline', 'Impact']],
                   vcSentimentData.fundingStrategy.milestones.map(m => [m?.milestone, m?.timeline, m?.impact])
               );
            }
     }
     yPos += SECTION_SPACING;
  }

  // --- Critical Thought Questions ---
  const criticalQuestionsSection = analysis.sections.criticalThoughtQuestions;
  if (isSectionComplete(criticalQuestionsSection)) {
      const criticalQuestionsData = criticalQuestionsSection as CriticalThoughtQuestions;
      addSectionTitle(doc, "Critical Thought Questions");
      (criticalQuestionsData.questions ?? []).forEach(category => {
          addSubHeading(doc, category?.category ?? 'Uncategorized Questions');
          if (category?.questions) {
              category.questions.forEach(q => {
                 yPos = checkAddPage(doc, yPos);
                 doc.setFontSize(11);
                 doc.setFont(undefined, 'bold');
                 doc.text(q?.question ?? 'Unnamed Question', PAGE_MARGIN, yPos);
                 doc.setFont(undefined, 'normal');
                 yPos += LINE_HEIGHT * 0.9;
                 addKeyValue(doc, "Importance", q?.importance, LIST_INDENT);
                 if (q?.context) {
                    addKeyValue(doc, "Context/Recommendations", q.context, LIST_INDENT);
                 }
                 yPos += SUBSECTION_SPACING / 2;
              });
          }
          yPos += SUBSECTION_SPACING;
      });
      yPos += SECTION_SPACING;
  }

  // --- Report Summary ---
  const reportSummarySection = analysis.sections.reportSummary;
  if (isSectionComplete(reportSummarySection)) {
    const reportSummaryData = reportSummarySection as ReportSummary;
    addSectionTitle(doc, "Report Summary");
    addKeyValue(doc, "Risk Level", reportSummaryData.riskLevel);
    addKeyValue(doc, "Confidence Score", `${reportSummaryData.confidenceScore ?? 'N/A'}/100`);
    addSubHeading(doc, "Overall Assessment");
    addParagraph(doc, reportSummaryData.overallAssessment);

    if (reportSummaryData.keyFindings && reportSummaryData.keyFindings.length > 0) {
      addSubHeading(doc, "Key Findings");
      addList(doc, reportSummaryData.keyFindings);
    }
    if (reportSummaryData.keyRecommendations && reportSummaryData.keyRecommendations.length > 0) {
      addSubHeading(doc, "Key Recommendations");
      addList(doc, reportSummaryData.keyRecommendations);
    }
     if (reportSummaryData.nextSteps && reportSummaryData.nextSteps.length > 0) {
        addSubHeading(doc, "Next Steps");
        addList(doc, reportSummaryData.nextSteps);
    }
  }

  // --- Save the PDF ---
  doc.save("ValiNow-Analysis-Report.pdf");
}

// --- CSV Export --- (Improved handling)
export function exportToCSV(analysis: AnalysisDocument) {
  let csv = "Section,Category,Key,Value\\n";

  function escapeCsv(value: any): string {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('\\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  Object.entries(analysis.sections).forEach(([sectionKey, sectionData]) => {
    if (isSectionComplete(sectionData)) { // Use type guard
       // Simplified flatten - consider a library for full complex object flattening
       Object.entries(sectionData).forEach(([key, value]) => {
          if (key !== 'status' && key !== 'sectionId' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'error') { // Exclude metadata
             if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
               csv += `${escapeCsv(sectionKey)},Main,${escapeCsv(key)},${escapeCsv(value)}\\n`;
             } else if (Array.isArray(value)) {
                 value.forEach((item, index) => {
                    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
                       csv += `${escapeCsv(sectionKey)},${escapeCsv(key)},${escapeCsv(index)},${escapeCsv(item)}\\n`;
                    } // Basic handling for arrays of primitives
                 });
             } // Add more specific handling for nested objects if needed
          }
       });
    }
  });
  
  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'business-analysis.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


// --- JSON Export --- (Keep existing implementation)
export function exportToJSON(analysis: AnalysisDocument) {
  const json = JSON.stringify(analysis, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'business-analysis.json');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
} 