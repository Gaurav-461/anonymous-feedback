import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

export async function GET(request: Request) {
  try {

    const messages =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qoph.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment and do not repeat the previous question got it.";

      const { text } = await generateText({
        model: google('gemini-2.0-flash-001'),
        prompt: messages,
      });

    return Response.json({ success: true, message: text });

  } catch (error) {
    console.error("Google Generative AI error:-", error);
    return Response.json(
      { success: false, message: "Google Generative AI error" },
      { status: 500 }
    );
  }
}

// import { openai } from "@ai-sdk/openai";
// import { generateText, streamText } from "ai";

// export async function GET(request: Request) {
//   try {
//     const messages =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qoph.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started? || If you could have dinner with any historical figure, who would it be? || What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";


//     // const result = streamText({ model: openai("gpt-4"), prompt: messages });

//     const { text } = await generateText({
//       model: openai('gpt-4'),
//       prompt: messages,
//     });

//     console.log(text);

//     return Response.json({ success: true, message: text });
//   } catch (error) {
//     console.error("Google Generative AI error:-", error);
//     return Response.json(
//       { success: false, message: "AI error from Backend" },
//       { status: 500 }
//     );
//   }
// }
