import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

interface RequestBody {
  title: string;
  content: string;
}

interface PerspectiveResponse {
  attributeScores: {
    TOXICITY: {
      summaryScore: {
        value: number;
      };
    };
  };
}

function validateInput(body: Partial<RequestBody>): string | null {
  if (!body.title || body.title.trim() === "") {
    return "Title is required and cannot be empty.";
  }
  if (!body.content || body.content.trim() === "") {
    return "Content is required and cannot be empty.";
  }
  return null;
}

function stripHtmlTags(html: string): string {
  const doc = new JSDOM(html);
  return doc.window.document.body.textContent || "";
}

const TOXICITY_THRESHOLD: number = parseFloat(
  process.env.TOXICITY_THRESHOLD || "0.5"
);
if (isNaN(TOXICITY_THRESHOLD)) {
  throw new Error(
    "TOXICITY_THRESHOLD is not a valid number in the environment variables."
  );
}

if (TOXICITY_THRESHOLD < 0 || TOXICITY_THRESHOLD > 1) {
  throw new Error("TOXICITY_THRESHOLD must be a number between 0 and 1.");
}

export async function POST(request: Request) {
  try {
    const { title, content }: Partial<RequestBody> = await request.json();

    const validationError = validateInput({ title, content });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const plainTextContent = stripHtmlTags(content!);

    console.log("Processing moderation for title:", title);

    const perspectiveResponse = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: { text: `${title} ${plainTextContent}` },
          languages: ["id"],
          requestedAttributes: { TOXICITY: {} },
        }),
      }
    );

    if (!perspectiveResponse.ok) {
      const errorBody = await perspectiveResponse.text();
      console.error("Perspective API Error:", errorBody);
      return NextResponse.json(
        { error: "Failed to moderate text content", details: errorBody },
        { status: 500 }
      );
    }

    const perspectiveData: PerspectiveResponse =
      await perspectiveResponse.json();
    const toxicityScore =
      perspectiveData.attributeScores.TOXICITY.summaryScore.value;

    console.log("Toxicity Score:", toxicityScore);

    return NextResponse.json(
      { isTextSafe: toxicityScore < TOXICITY_THRESHOLD },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error during moderation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during moderation." },
      { status: 500 }
    );
  }
}
