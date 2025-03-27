import { AnalysisDocument } from "@/lib/ai/models";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export async function exportToPDF(analysis: AnalysisDocument) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text("Business Analysis Report", 20, 20);
  
  // Add sections
  let yPos = 40;
  
  // Executive Summary
  if (analysis.sections.executiveSummary?.status === 'completed') {
    const summary = analysis.sections.executiveSummary;
    doc.setFontSize(16);
    doc.text("Executive Summary", 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(summary.summary || "", 20, yPos, { maxWidth: 170 });
    yPos += 30;
  }
  
  // Marketing Channels
  if (analysis.sections.marketingChannels?.status === 'completed') {
    const channels = analysis.sections.marketingChannels;
    doc.setFontSize(16);
    doc.text("Marketing Channels", 20, yPos);
    yPos += 10;
    
    if (channels.budget?.breakdown) {
      const data = channels.budget.breakdown.map(item => [
        item.category,
        item.amount,
        item.percentage
      ]);
      
      autoTable(doc, {
        head: [['Category', 'Amount', 'Percentage']],
        body: data,
        startY: yPos
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;
    }
  }
  
  // Go to Market Plan
  if (analysis.sections.goToMarketPlan?.status === 'completed') {
    const gtm = analysis.sections.goToMarketPlan;
    doc.setFontSize(16);
    doc.text("Go-to-Market Plan", 20, yPos);
    yPos += 10;
    
    if (gtm.launchStrategy?.phases?.length > 0) {
      doc.setFontSize(12);
      doc.text("Launch Strategy:", 20, yPos);
      yPos += 10;
      
      gtm.launchStrategy.phases.forEach((phase, index) => {
        doc.text(`Phase ${index + 1}: ${phase.phase}`, 30, yPos);
        yPos += 10;
        doc.text(`Timeline: ${phase.timeline}`, 40, yPos);
        yPos += 10;
        if (phase.activities?.length > 0) {
          doc.text("Activities:", 40, yPos);
          yPos += 10;
          phase.activities.forEach(activity => {
            doc.text(`- ${activity}`, 50, yPos);
            yPos += 7;
          });
        }
        yPos += 10;
      });
    }
  }
  
  // Add more sections as needed...
  
  // Save the PDF
  doc.save("business-analysis.pdf");
}

export function exportToCSV(analysis: AnalysisDocument) {
  let csv = "Section,Category,Value\n";
  
  // Add Executive Summary
  if (analysis.sections.executiveSummary?.status === 'completed') {
    csv += `Executive Summary,Summary,${analysis.sections.executiveSummary.summary}\n`;
  }
  
  // Add Marketing Channels
  if (analysis.sections.marketingChannels?.status === 'completed') {
    const channels = analysis.sections.marketingChannels;
    if (channels.budget?.breakdown) {
      channels.budget.breakdown.forEach(item => {
        csv += `Marketing Channels,${item.category},${item.amount}\n`;
      });
    }
  }
  
  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'business-analysis.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

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