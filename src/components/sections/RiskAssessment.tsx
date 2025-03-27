import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskAssessment as RiskAssessmentType } from "@/lib/models/analysis";
import { Progress } from "@/components/ui/progress";

interface RiskAssessmentProps {
  data: RiskAssessmentType;
}

export function RiskAssessment({ data }: RiskAssessmentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">Overall Risk Score</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{data.riskScore}/100</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${data.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Market Risks</h3>
            <div className="grid gap-4">
              {data.marketRisks.map((risk, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{risk.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600">Likelihood: {risk.likelihood}</span>
                      <span className="text-sm text-gray-600">Impact: {risk.impact}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-1">Mitigation Strategies:</p>
                    <ul className="list-disc list-inside">
                      {risk.mitigationStrategies.map((strategy, i) => (
                        <li key={i} className="text-sm">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Operational Risks</h3>
            <div className="grid gap-4">
              {data.operationalRisks.map((risk, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{risk.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600">Likelihood: {risk.likelihood}</span>
                      <span className="text-sm text-gray-600">Impact: {risk.impact}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-1">Mitigation Strategies:</p>
                    <ul className="list-disc list-inside">
                      {risk.mitigationStrategies.map((strategy, i) => (
                        <li key={i} className="text-sm">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Financial Risks</h3>
            <div className="grid gap-4">
              {data.financialRisks.map((risk, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{risk.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600">Likelihood: {risk.likelihood}</span>
                      <span className="text-sm text-gray-600">Impact: {risk.impact}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-1">Mitigation Strategies:</p>
                    <ul className="list-disc list-inside">
                      {risk.mitigationStrategies.map((strategy, i) => (
                        <li key={i} className="text-sm">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 