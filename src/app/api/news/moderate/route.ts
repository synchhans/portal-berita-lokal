import { NextResponse } from "next/server";

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
    return "Title is required";
  }
  if (!body.content || body.content.trim() === "") {
    return "Content is required";
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { title, content }: Partial<RequestBody> = await request.json();

    const validationError = validateInput({ title, content });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    console.log(content);

    const perspectiveResponse = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: { text: `${title} ${content}` },
          languages: ["id"],
          requestedAttributes: { TOXICITY: {} },
        }),
      }
    );

    if (!perspectiveResponse.ok) {
      const errorBody = await perspectiveResponse.text();
      console.error("Perspective API Error:", errorBody);
      return NextResponse.json(
        { error: "Failed to moderate text content" },
        { status: 500 }
      );
    }

    const perspectiveData: PerspectiveResponse =
      await perspectiveResponse.json();
    const toxicityScore =
      perspectiveData.attributeScores.TOXICITY.summaryScore.value;

    console.log("Toxicity Score:", toxicityScore);

    return NextResponse.json(
      { isTextSafe: toxicityScore < 0.2 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
