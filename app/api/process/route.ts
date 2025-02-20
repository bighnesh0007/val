import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { input } = await request.json();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
  Analyze this meeting text and extract the following details in JSON format:
  - Meeting details: date, time, location
  - Action items: task, assignee, deadline, priority
  - Key discussion points
  - Meeting summary

  Example input: "Team meeting on Monday at 2 PM in Conference Room A. John will prepare the Q1 report by next Friday (high priority). We discussed budget projections for Q2 and new hiring plans for the engineering team. Sarah needs to review the marketing strategy by end of month. Meeting lasted about 90 minutes. Action items include: Mike to update the project timeline by Wednesday, Lisa to schedule follow-up meetings with stakeholders."

  Example output:
  {
    "meetingDetails": {
      "date": "2023-10-16",
      "time": "14:00",
      "location": "Conference Room A"
    },
    "actionItems": [
      {
        "task": "Prepare the Q1 report",
        "assignee": "John",
        "deadline": "next Friday",
        "priority": "High"
      },
      {
        "task": "Update the project timeline",
        "assignee": "Mike",
        "deadline": "Wednesday",
        "priority": "Medium"
      }
    ],
    "keyDiscussionPoints": [
      "Budget projections for Q2",
      "New hiring plans for the engineering team"
    ],
    "meetingSummary": "The team discussed Q1 reports, budget projections for Q2, and new hiring plans. Action items were assigned to John and Mike."
  }

  Input: "${input}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsedResponse = JSON.parse(cleanedText);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process notes" }, { status: 500 });
  }
}