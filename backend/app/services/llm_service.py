from groq import APIError, AsyncGroq

from app.config import settings

_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPTS = {
    "technical": (
        "You are a technical writer specializing in software release notes.\n"
        "Generate a clean, structured changelog in Markdown from the provided "
        "git commits or diff.\n"
        "Use conventional sections: Added, Changed, Fixed, Removed.\n"
        "Be concise and precise. Output only the Markdown, no preamble."
    ),
    "user_friendly": (
        "You are a product writer creating release notes for end users.\n"
        "Generate friendly, readable release notes in Markdown from the provided "
        "git commits or diff.\n"
        "Focus on what changed for the user, not implementation details.\n"
        "Use plain language. Output only the Markdown, no preamble."
    ),
}


class LLMError(Exception):
    """Raised when the LLM provider fails to generate a changelog."""


async def generate_changelog(
    raw_input: str, tone: str, version_tag: str | None
) -> str:
    system_prompt = SYSTEM_PROMPTS.get(tone, SYSTEM_PROMPTS["technical"])

    user_message = raw_input
    if version_tag:
        user_message = f"Version: {version_tag}\n\n{raw_input}"

    try:
        completion = await _client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
        )
    except APIError as exc:
        raise LLMError(str(exc)) from exc

    content = completion.choices[0].message.content
    if not content or not content.strip():
        raise LLMError("LLM returned empty content")
    return content.strip()
