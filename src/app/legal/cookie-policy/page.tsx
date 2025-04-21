export default function CookiePolicyPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Cookie Policy</h1>
      <p><em>Effective Date: 15 April 2025</em></p>

      <h2>3.1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device.</p>

      <h2>3.2. Cookies We Use</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Cookie / Provider</th>
              <th>Purpose</th>
              <th>Lifespan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Strictly Necessary</strong></td>
              <td><code>sb-auth</code>, <code>sb-access-token</code>, <code>sb-refresh-token</code> (Supabase)</td>
              <td>Authentication & session management</td>
              <td>Session / up to 7 days</td>
            </tr>
            <tr>
              <td><strong>Analytics</strong></td>
              <td>Google Analytics (<code>_ga</code>, <code>_gid</code>, <code>_gat</code>)</td>
              <td>Measure usage</td>
              <td>1 day – 2 years</td>
            </tr>
            <tr>
              <td><strong>Payment</strong></td>
              <td>Stripe checkout cookies</td>
              <td>Ensure payment session</td>
              <td>Session</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3.3. Consent & Control</h2>
      <p>You will see a cookie banner on first visit. You can withdraw consent at any time via the "Cookie Settings" link or by clearing cookies in your browser.</p>

      <h2>3.4. Changes</h2>
      <p>Updates will be posted here with a new "Effective Date."</p>

      <hr />
      <p className="text-sm text-gray-500">Last updated: April 15, 2025</p>
    </div>
  )
} 