// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { meetingSummary, actionItems, keyDiscussionPoints } = await request.json();

    // Validate the required fields
    if (!meetingSummary || !actionItems || !keyDiscussionPoints) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the email using Mailjet
    const requestMailjet = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.SENDER_EMAIL,
            Name: 'Meeting Notes Pro',
          },
          To: [
            {
              Email: process.env.RECIPIENT_EMAIL,
              Name: 'Recipient',
            },
          ],
          Subject: 'Meeting Notes Summary',
          TextPart: `Meeting Summary: ${meetingSummary}\n\nAction Items: ${actionItems
            .map((item: { task: string }) => `- ${item.task}`)
            .join('\n')}\n\nKey Discussion Points: ${keyDiscussionPoints.join('\n')}`,
          HTMLPart: `
            <h3>Meeting Summary</h3>
            <p>${meetingSummary}</p>
            <h3>Action Items</h3>
            <ul>${actionItems
              .map((item: { task: string }) => `<li>${item.task}</li>`)
              .join('')}</ul>
            <h3>Key Discussion Points</h3>
            <ul>${keyDiscussionPoints
              .map((point: string) => `<li>${point}</li>`)
              .join('')}</ul>
          `,
        },
      ],
    });

    const result = await requestMailjet;
    return NextResponse.json(
      { message: 'Email sent successfully!', result: result.body },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error:', err.statusCode, err.message);
    return NextResponse.json(
      { message: 'Failed to send email.', error: err.message },
      { status: 500 }
    );
  }
}