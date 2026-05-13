import {NextResponse} from 'next/server'
import {createSign} from 'node:crypto'
import {sanityClient} from '@/lib/sanity/client'

type FormField = {
  name?: string
  label?: string
  fieldType?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  required?: boolean
  options?: Array<string>
}

type ContactFormConfig = {
  postmarkFromEmail?: string
  postmarkFromName?: string
  destinationEmail?: string
  postmarkSubject?: string
  sheetsSheetId?: string
  sheetsSheetName?: string
  formFields?: Array<FormField>
}

type SubmissionBody = {
  blockKey?: string
  values?: Record<string, string | boolean>
  botField?: string
  sourcePath?: string
}

const formConfigQuery = `*[_type == "appearance"] | order(_updatedAt desc)[0]{
  "block": activeHomePage->blocks[_type == "contactFormBlock" && _key == $blockKey][0]{
    postmarkFromEmail,
    postmarkFromName,
    destinationEmail,
    postmarkSubject,
    sheetsSheetId,
    sheetsSheetName,
    formFields[]{
      name,
      label,
      fieldType,
      required,
      options
    }
  }
}`

const DEFAULT_POSTMARK_FROM_EMAIL = 'forms@hungryramwebdesign.com'

function isSafeFieldName(value: string | undefined): value is string {
  return Boolean(value && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(value))
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function serializeValue(value: string | boolean | undefined) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return (value ?? '').toString().trim()
}

function getEmailFromValues(values: Record<string, string | boolean>, fields: Array<FormField>) {
  for (const field of fields) {
    if (field.fieldType !== 'email' || !isSafeFieldName(field.name)) continue
    const value = values[field.name]
    if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  }
  return undefined
}

function sanitizeDisplayName(value: string | undefined) {
  return (value ?? '').replace(/[\r\n<>\"]/g, '').trim()
}

function buildFromHeader(fromEmail: string, fromName: string | undefined) {
  const safeName = sanitizeDisplayName(fromName)
  return safeName ? `${safeName} <${fromEmail}>` : fromEmail
}

export async function POST(request: Request) {
  const postmarkToken = process.env.POSTMARK_API_TOKEN
  if (!postmarkToken) {
    return NextResponse.json({ok: false, message: 'Server email is not configured.'}, {status: 500})
  }

  const payload = (await request.json()) as SubmissionBody
  if (!payload.blockKey) {
    return NextResponse.json({ok: false, message: 'Missing form identifier.'}, {status: 400})
  }

  if (payload.botField?.trim()) {
    return NextResponse.json({ok: true})
  }

  if (!sanityClient) {
    return NextResponse.json({ok: false, message: 'CMS client is not configured.'}, {status: 500})
  }

  const data = await sanityClient.fetch<{block?: ContactFormConfig}>(formConfigQuery, {
    blockKey: payload.blockKey,
  })

  const formConfig = data?.block
  if (!formConfig) {
    return NextResponse.json({ok: false, message: 'Form configuration was not found.'}, {status: 404})
  }

  if (!formConfig.destinationEmail) {
    return NextResponse.json({ok: false, message: 'Form email destination is not configured.'}, {status: 500})
  }

  const fromEmail = formConfig.postmarkFromEmail?.trim() || DEFAULT_POSTMARK_FROM_EMAIL

  const incomingValues = payload.values ?? {}
  const fields = (formConfig.formFields ?? []).filter((field) => isSafeFieldName(field.name))

  if (fields.length === 0) {
    return NextResponse.json({ok: false, message: 'No form fields are configured.'}, {status: 500})
  }

  const normalized: Array<{name: string; label: string; value: string}> = []

  for (const field of fields) {
    const name = field.name as string
    const label = field.label?.trim() || name
    const rawValue = incomingValues[name]

    if (field.required) {
      if (field.fieldType === 'checkbox') {
        if (rawValue !== true) {
          return NextResponse.json({ok: false, message: `${label} is required.`}, {status: 400})
        }
      } else {
        const requiredValue = serializeValue(rawValue)
        if (!requiredValue) {
          return NextResponse.json({ok: false, message: `${label} is required.`}, {status: 400})
        }
      }
    }

    if (field.fieldType === 'select' && Array.isArray(field.options) && field.options.length > 0) {
      const selected = serializeValue(rawValue)
      if (selected && !field.options.includes(selected)) {
        return NextResponse.json({ok: false, message: `${label} has an invalid value.`}, {status: 400})
      }
    }

    if (field.fieldType === 'email') {
      const email = serializeValue(rawValue)
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return NextResponse.json({ok: false, message: `${label} must be a valid email.`}, {status: 400})
        }
      }
    }

    normalized.push({name, label, value: serializeValue(rawValue)})
  }

  const submittedAtDate = new Date()
  const submittedAt = submittedAtDate.toISOString()
  const submittedAtFormatted = submittedAtDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })
  const sourcePath = payload.sourcePath || '/'
  const resolvedSubject = formConfig.postmarkSubject || 'New Contact Form Submission'

  const textBody = [
    `Hungryram - New Contact Form Submission`,
    `========================================`,
    `Submitted: ${submittedAtFormatted}`,
    `Page: ${sourcePath}`,
    '',
    `Fields`,
    `------`,
    ...normalized.map((entry) => `${entry.label}: ${entry.value || '-'}`),
    '',
    `Powered by Hungry Ram: https://hungryram.com`,
  ].join('\n')

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px;color:#111827;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="padding:20px 24px;background:#111827;color:#ffffff;">
          <h2 style="margin:0;font-size:20px;line-height:1.3;">${escapeHtml(resolvedSubject)}</h2>
        </div>

        <div style="padding:20px 24px;">
          <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;margin-bottom:16px;">
            <tr>
              <td style="padding:4px 0;color:#6b7280;width:140px;"><strong>Submitted</strong></td>
              <td style="padding:4px 0;color:#111827;">${escapeHtml(submittedAtFormatted)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;"><strong>Page</strong></td>
              <td style="padding:4px 0;color:#111827;">${escapeHtml(sourcePath)}</td>
            </tr>
          </table>

          <h3 style="margin:0 0 10px;font-size:15px;color:#111827;">Submission Details</h3>
          <table cellpadding="10" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:14px;">
            <tbody>
              ${normalized
                .map(
                  (entry) =>
                    `<tr><th align="left" style="width:34%;background:#f9fafb;border-bottom:1px solid #e5e7eb;color:#374151;">${escapeHtml(entry.label)}</th><td style="border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(entry.value || '-')}</td></tr>`,
                )
                .join('')}
            </tbody>
          </table>

          <div style="margin:20px 0 0;padding:16px 0 0;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Powered by <a href="https://hungryram.com" target="_blank" rel="noopener noreferrer" style="color:#111827;text-decoration:none;font-weight:500;">Hungry Ram</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `

  const senderEmail = getEmailFromValues(incomingValues, fields)

  const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': postmarkToken,
    },
    body: JSON.stringify({
      From: buildFromHeader(fromEmail, formConfig.postmarkFromName),
      To: formConfig.destinationEmail,
      Subject: resolvedSubject,
      TextBody: textBody,
      HtmlBody: htmlBody,
      ReplyTo: senderEmail,
      MessageStream: 'outbound',
    }),
  })

  if (!postmarkResponse.ok) {
    const postmarkError = await postmarkResponse.text()
    console.error('Postmark error:', postmarkError)
    return NextResponse.json(
      {ok: false, message: 'Could not send form submission email.'},
      {status: 502},
    )
  }

  if (formConfig.sheetsSheetId && formConfig.sheetsSheetName) {
    const clientEmail = process.env.SHEETS_CLIENT_EMAIL
    const privateKey = process.env.SHEETS_PRIVATE_KEY

    if (clientEmail && privateKey) {
      try {
        const valueRow = [
          submittedAt,
          sourcePath,
          ...normalized.map((entry) => entry.value),
        ]
        await appendToGoogleSheet({
          sheetId: formConfig.sheetsSheetId,
          sheetName: formConfig.sheetsSheetName,
          clientEmail,
          privateKey,
          values: valueRow,
        })
      } catch (error) {
        console.error('Google Sheets append error:', error)
      }
    }
  }

  return NextResponse.json({ok: true})
}

async function appendToGoogleSheet({
  sheetId,
  sheetName,
  clientEmail,
  privateKey,
  values,
}: {
  sheetId: string
  sheetName: string
  clientEmail: string
  privateKey: string
  values: Array<string>
}) {
  const jwt = createJwt(clientEmail, privateKey)
  const accessToken = await getAccessToken(jwt)

  const range = `${sheetName}!A1`

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [values],
    }),
  })
}

function createJwt(clientEmail: string, privateKey: string): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: clientEmail,
    sub: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url')
  const claimEncoded = Buffer.from(JSON.stringify(claim)).toString('base64url')
  const message = `${headerEncoded}.${claimEncoded}`

  const signature = createSign('RSA-SHA256')
    .update(message)
    .sign(privateKey, 'base64url')

  return `${message}.${signature}`
}

async function getAccessToken(jwt: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  const data = (await response.json()) as {access_token: string}
  return data.access_token
}
