export default function PrivacyPolicyPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Privacy Policy</h1>
      <p><em>Effective Date: 15 April 2025</em></p>

      <h2>1.1. Who We Are</h2>
      <p>ValidFlow ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") is operated by <strong>Max Henkes</strong>, Infanteriestraße 14A, Munich, Germany. Contact: <strong>henkes2max@gmail.com</strong>.</p>

      <h2>1.2. Scope</h2>
      <p>This Privacy Policy explains how we collect, use, share and protect personal data when you use ValidFlow (the "<strong>Service</strong>"). It is drafted to meet the requirements of the EU General Data Protection Regulation (GDPR).</p>

      <h2>1.3. Data We Process</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Examples</th>
              <th>Purpose</th>
              <th>Legal Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Account Data</strong></td>
              <td>Name (optional), email address, hashed password, Stripe customer ID</td>
              <td>Account creation & log‑in</td>
              <td>Art. 6 (1)(b) GDPR – contract performance</td>
            </tr>
            <tr>
              <td><strong>Business Idea Inputs & Files</strong></td>
              <td>Text you submit describing an idea</td>
              <td>Core AI analysis</td>
              <td>Art. 6 (1)(b) GDPR – contract performance</td>
            </tr>
            <tr>
              <td><strong>Generated Reports</strong></td>
              <td>PDF & dashboard output</td>
              <td>Provide service & history</td>
              <td>Art. 6 (1)(b)</td>
            </tr>
            <tr>
              <td><strong>Payment Data</strong></td>
              <td>Card details (processed directly by Stripe)</td>
              <td>Billing</td>
              <td>Art. 6 (1)(b)</td>
            </tr>
            <tr>
              <td><strong>Usage Data / Cookies</strong></td>
              <td>IP address, device type, pages visited (via Google Analytics & Vercel logs)</td>
              <td>Analytics, security</td>
              <td>Art. 6 (1)(f) – legitimate interests (service improvement) / Art. 6 (1)(a) – consent (non‑essential cookies)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>1.4. Automated Processing & AI</h2>
      <p>We transmit your inputs to <strong>OpenAI LLC</strong> and <strong>Anthropic PBC</strong> to generate validation results. Processing is automated; no solely‑automated decision produces legal effects concerning you.</p>

      <h2>1.5. Retention</h2>
      <ul>
        <li>Account & idea data: kept <strong>until you delete the project or request erasure</strong>.</li>
        <li>Generated PDF reports: same as above.</li>
        <li>Billing records: <strong>10 years</strong> (German tax law).</li>
        <li>Server logs & backups: <strong>30 days</strong>.</li>
      </ul>

      <h2>1.6. Sub‑processors & International Transfers</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Role</th>
              <th>Location</th>
              <th>Safeguard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Supabase Inc.</td>
              <td>Auth & DB</td>
              <td>EU DC + US backup</td>
              <td>Standard Contractual Clauses (SCCs)</td>
            </tr>
            <tr>
              <td>Vercel Inc.</td>
              <td>Hosting</td>
              <td>EU & US</td>
              <td>SCCs</td>
            </tr>
            <tr>
              <td>OpenAI LLC</td>
              <td>AI inference</td>
              <td>US</td>
              <td>SCCs</td>
            </tr>
            <tr>
              <td>Anthropic PBC</td>
              <td>AI inference</td>
              <td>US</td>
              <td>SCCs</td>
            </tr>
            <tr>
              <td>Stripe Payments Europe Ltd. / Stripe Inc.</td>
              <td>Payments</td>
              <td>EU/US</td>
              <td>Intra‑group SCCs</td>
            </tr>
            <tr>
              <td>Google LLC (Analytics)</td>
              <td>Analytics</td>
              <td>US</td>
              <td>SCCs</td>
            </tr>
            <tr>
              <td>Resend Inc.</td>
              <td>Transactional emails</td>
              <td>US</td>
              <td>SCCs</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Transfers outside the EEA rely on SCCs under Art. 46 GDPR.</p>

      <h2>1.7. Your Rights</h2>
      <p>You may <strong>access, rectify, erase, restrict, object to processing</strong>, or <strong>receive a copy</strong> of your data (data portability). Contact us at the address above. You have the right to lodge a complaint with the Bavarian Data Protection Authority or your local supervisory authority.</p>

      <h2>1.8. Security</h2>
      <p>We use TLS encryption in transit, AES‑256 at rest (Supabase), role‑based access, and least‑privilege keys.</p>

      <h2>1.9. Children</h2>
      <p>The Service is not directed to anyone under <strong>16 years</strong>. We do not knowingly collect data from children under 16; parents may contact us to delete such data.</p>

      <h2>1.10. Changes</h2>
      <p>We may update this Privacy Policy. Material changes will be announced by email or in‑app notice at least 14 days before they take effect.</p>

      <hr />
      <p className="text-sm text-gray-500">Last updated: April 15, 2025</p>
    </div>
  )
} 