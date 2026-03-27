// ═══════════════════════════════════════════════════════════════
// AI Operating System — Lead Capture & Email Delivery (FINAL)
// ═══════════════════════════════════════════════════════════════

// ── CONFIG ─────────────────────────────────────────────────────
const SHEET_ID = '11e6rtm2-u8UG1ipaZm_Ms5_IG2lFxKxUQrUQ6LHG6Us';
const PDF_DRIVE_ID = '1XAT--XPBFX_qVS2mU3L9oQfipQLSzres';

const SENDER_NAME = 'Simply Staffed AI';
const UNSUBSCRIBE_EMAIL = 'unsubscribe@simplystaffed.com';
const WEBSITE_URL = 'https://simplystaffed.com';

const EMAIL_SUBJECT = 'Your Free AI Operating System Playbook';

// ═══════════════════════════════════════════════════════════════
// ── MAIN FUNCTION ──────────────────────────────────────────────
function doPost(e) {
  try {
    // ── GET DATA ──
    const name  = e.parameter.name  || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const role  = e.parameter.role  || '';

    // ── VALIDATION ──
    if (!email) {
      return ContentService.createTextOutput('error: missing email');
    }

    // ── SAVE TO GOOGLE SHEETS ──
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'First Name', 'Email', 'Mobile', 'Role']);
      sheet.getRange(1, 1, 1, 5)
        .setFontWeight('bold')
        .setBackground('#4a2a50')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      name,
      email,
      phone,
      role
    ]);

    // ── GET PDF ──
    const file = DriveApp.getFileById(PDF_DRIVE_ID);
    const pdfBlob = file.getBlob().setName('AI_Operating_System_Playbook.pdf');

    const firstName = name ? name.split(' ')[0] : 'there';

    // ── EMAIL CONTENT ──
    const htmlBody = `
    <div style="font-family:Arial,sans-serif;background:#f7f3fd;padding:30px;">
      <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;">
        
        <div style="background:#4a2a50;color:#fff;padding:25px;text-align:center;">
          <h2 style="margin:0;">The AI Operating System</h2>
          <p style="margin:5px 0 0;font-size:14px;">for Property Professionals</p>
        </div>

        <div style="padding:25px;">
          <p style="font-size:16px;"><strong>Hey ${firstName},</strong></p>

          <p>Your free playbook is attached.</p>

          <p>
            Start with <strong>Section 2 — the 3 Things to Do This Week</strong>
            to get quick wins immediately.
          </p>

          <p>If you have questions, just reply to this email.</p>
        </div>

        <div style="background:#f4f0f8;padding:15px;text-align:center;font-size:12px;">
          <p style="margin:0;">
            <a href="${WEBSITE_URL}" style="color:#4a2a50;">simplystaffed.com</a>
          </p>
          <p style="margin:5px 0 0;">
            <a href="mailto:${UNSUBSCRIBE_EMAIL}?subject=Unsubscribe&body=Please remove me (${email})"
               style="color:#888;">Unsubscribe</a>
          </p>
        </div>

      </div>
    </div>
    `;

    const plainText = `
Hey ${firstName},

Your AI Operating System playbook is attached.

Start with Section 2 to get quick wins.

— Simply Staffed AI
${WEBSITE_URL}
`;

    // ── SEND EMAIL ──
    GmailApp.sendEmail(email, EMAIL_SUBJECT, plainText, {
      name: SENDER_NAME,
      htmlBody: htmlBody,
      attachments: [pdfBlob]
    });

    return ContentService.createTextOutput('success');

  } catch (err) {
    Logger.log(err);
    return ContentService.createTextOutput('error: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// ── TEST ENDPOINT ──────────────────────────────────────────────
function doGet() {
  return ContentService.createTextOutput('OK');
}
