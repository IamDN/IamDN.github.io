console.log("dsa");
import Anthropic from '/da/@anthropic-ai/sdk';
console.log("da");
const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});
console.log("ba");
async function main() {
  console.log("Start");
  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hello, Claude' }],
    model: 'claude-3-opus-20240229',
  });

  console.log(message.content);
}
main();