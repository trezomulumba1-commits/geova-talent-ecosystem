"""Gemini AI endpoints — port of the original Node server.ts routes.

Keeps the exact request/response contract the frontend already consumes
(PracticeArenaView, SystemArchitectView, ResumeReportModal). When no
GEMINI_API_KEY is configured, endpoints return the same mock fallbacks as the
original server did.
"""

import json
import random

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.config import settings
from google import genai
from google.genai import types as genai_types

router = APIRouter(prefix="/api/gemini", tags=["ai"])

MODEL = "gemini-2.5-flash"


class InterviewRequest(BaseModel):
    question: str = ""
    category: str | None = None
    transcript: str | None = None
    code: str | None = None
    codeLanguage: str | None = None
    timeSpentSeconds: int | None = None
    studentName: str | None = None


class CodeReviewRequest(BaseModel):
    code: str = ""
    language: str | None = None
    questionTitle: str | None = None


class QuestionRequest(BaseModel):
    role: str | None = None
    difficulty: str | None = None
    topic: str | None = None


class SummaryRequest(BaseModel):
    studentName: str | None = None
    role: str | None = None
    skills: list[str] | None = None
    completedSessions: int | None = None
    verifiedProjects: list[str] | None = None


_client: genai.Client | None = None


def _client_or_none() -> genai.Client | None:
    global _client
    if _client is None and settings.gemini_api_key:
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def _generate(prompt: str, schema: dict) -> dict:
    client = _client_or_none()
    assert client is not None
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=genai_types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
        ),
    )
    return json.loads(response.text or "{}")


@router.post("/evaluate-interview")
async def evaluate_interview(body: InterviewRequest):
    ai = _client_or_none()
    if not ai:
        score = random.randint(82, 96)
        return {
            "overallScore": score,
            "grade": "A+" if score >= 90 else "A" if score >= 80 else "B+",
            "rubric": {
                "technicalAccuracy": {"score": min(100, score + 4), "comment": "Strong grasp of fundamental concepts and system trade-offs with structured explanation."},
                "communicationClarity": {"score": min(100, score + 2), "comment": "Clear articulation, structured pacing, and good use of terminology."},
                "problemSolving": {"score": score, "comment": "Solid step-by-step reasoning from requirements analysis to edge case mitigation."},
                "codeQualityOrStructure": {"score": max(70, score - 3), "comment": "Well-organized syntax, sensible naming, and modular separation." if body.code else "Theoretical approach was sound; incorporating more live code examples would enhance depth."},
            },
            "strengths": ["Demonstrated proactive requirement verification before diving into the implementation.", "Clear explanation of time and space complexity trade-offs.", "Effective communication structure matching senior engineering expectations."],
            "areasForImprovement": ["Could dive deeper into distributed failure modes and data replication strategies.", "Consider discussing concurrency limits and bottleneck handling under 10x traffic spikes."],
            "modelIdealAnswer": "A top-tier response addresses scale, reliability, and failover.",
            "followUpQuestion": "How would you ensure graceful degradation if your primary database replica experiences network partitioning?",
            "recruiterReadinessVerdict": "Fast-Track Recommended" if score >= 85 else "Ready for Technical Rounds",
        }

    prompt = f'You are an expert technical interviewer. Candidate: {body.studentName or "Candidate"}. Question: "{body.question}". Answer: """{body.transcript}""". Code: """{body.code or "None"}""". Time: {body.timeSpentSeconds}s. Evaluate rigorously.'
    schema = {
        "type": "object",
        "properties": {
            "overallScore": {"type": "integer"},
            "grade": {"type": "string"},
            "rubric": {
                "type": "object",
                "properties": {
                    "technicalAccuracy": {"type": "object", "properties": {"score": {"type": "integer"}, "comment": {"type": "string"}}, "required": ["score", "comment"]},
                    "communicationClarity": {"type": "object", "properties": {"score": {"type": "integer"}, "comment": {"type": "string"}}, "required": ["score", "comment"]},
                    "problemSolving": {"type": "object", "properties": {"score": {"type": "integer"}, "comment": {"type": "string"}}, "required": ["score", "comment"]},
                    "codeQualityOrStructure": {"type": "object", "properties": {"score": {"type": "integer"}, "comment": {"type": "string"}}, "required": ["score", "comment"]},
                },
                "required": ["technicalAccuracy", "communicationClarity", "problemSolving", "codeQualityOrStructure"],
            },
            "strengths": {"type": "array", "items": {"type": "string"}},
            "areasForImprovement": {"type": "array", "items": {"type": "string"}},
            "modelIdealAnswer": {"type": "string"},
            "followUpQuestion": {"type": "string"},
            "recruiterReadinessVerdict": {"type": "string"},
        },
        "required": ["overallScore", "grade", "rubric", "strengths", "areasForImprovement", "modelIdealAnswer", "followUpQuestion", "recruiterReadinessVerdict"],
    }
    try:
        result = _generate(prompt, schema)
        return result
    except Exception as err:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": "Failed to evaluate interview response", "details": str(err)})


@router.post("/code-review")
async def code_review(body: CodeReviewRequest):
    ai = _client_or_none()
    if not ai:
        return {"valid": True, "timeComplexity": "O(N log N)", "spaceComplexity": "O(1)", "summary": "Clean solution with correct core logic.", "suggestions": ["Handle edge cases explicitly.", "Add return type annotations."], "testCasesStatus": "All 3 sample tests passing."}

    prompt = f'Code review for "{body.questionTitle}":\n```{body.language}\n{body.code}\n```'
    schema = {
        "type": "object",
        "properties": {
            "valid": {"type": "boolean"},
            "timeComplexity": {"type": "string"},
            "spaceComplexity": {"type": "string"},
            "summary": {"type": "string"},
            "suggestions": {"type": "array", "items": {"type": "string"}},
            "testCasesStatus": {"type": "string"},
        },
        "required": ["valid", "timeComplexity", "spaceComplexity", "summary", "suggestions", "testCasesStatus"],
    }
    try:
        return _generate(prompt, schema)
    except Exception as err:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": str(err) or "Failed to analyze code"})


@router.post("/generate-question")
async def generate_question(body: QuestionRequest):
    ai = _client_or_none()
    if not ai:
        return {
            "id": f"q-{random.randint(0, 999999999)}",
            "number": 1,
            "total": 5,
            "category": body.topic or "System Architecture",
            "question": "Design an event-driven notification service capable of processing 100,000 push events per second with at-least-once delivery guarantees.",
            "focusAreas": ["Throughput & Scalability", "Message Queuing", "Dead Letter Queues", "Idempotency"],
            "expectedKeywords": ["Kafka / SQS", "Worker Pool", "Idempotency Key", "Redis Dedup", "Backpressure"],
            "sampleAnswerHint": "Outline the API gateway ingestion, async broker buffer, consumer worker groups, and exponential backoff retry policies.",
            "starterCode": "// Event Notification Dispatcher\nexport async function dispatchBatch(events: any[]): Promise<{ dispatched: number }> {\n  return { dispatched: events.length };\n}",
        }

    prompt = f'Generate a technical interview question for a {body.role or "Software Engineer"} level {body.difficulty or "Mid-to-Senior"} focusing on {body.topic or "Distributed Systems"}.'
    schema = {
        "type": "object",
        "properties": {
            "category": {"type": "string"},
            "question": {"type": "string"},
            "focusAreas": {"type": "array", "items": {"type": "string"}},
            "expectedKeywords": {"type": "array", "items": {"type": "string"}},
            "sampleAnswerHint": {"type": "string"},
            "starterCode": {"type": "string"},
        },
        "required": ["category", "question", "focusAreas", "expectedKeywords", "sampleAnswerHint", "starterCode"],
    }
    try:
        result = _generate(prompt, schema)
        return {"id": f"q-{random.randint(0, 999999999)}", "number": 1, "total": 5, **result}
    except Exception as err:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": str(err) or "Failed to generate question"})


@router.post("/generate-candidate-summary")
async def generate_candidate_summary(body: SummaryRequest):
    ai = _client_or_none()
    if not ai:
        return {
            "executiveSummary": f'{body.studentName or "This engineer"} exhibits exceptional technical prowess verified through rigorous proctored evaluations.',
            "endorsementScore": 94,
            "keyCompetencies": ["Architecture Design", "Distributed Systems", "Full-Stack TypeScript", "Production Hardening"],
            "recruiterNotes": "Candidate has demonstrated fast execution, clean code hygiene, and verified proficiency.",
        }

    prompt = f'Write an official GEOVA Verified Candidate Endorsement for:\nName: {body.studentName}\nRole: {body.role}\nSkills: {", ".join(body.skills or [])}\nCompleted Interview Sessions: {body.completedSessions or 4}\nVerified Projects: {", ".join(body.verifiedProjects or [])}'
    schema = {
        "type": "object",
        "properties": {
            "executiveSummary": {"type": "string"},
            "endorsementScore": {"type": "integer"},
            "keyCompetencies": {"type": "array", "items": {"type": "string"}},
            "recruiterNotes": {"type": "string"},
        },
        "required": ["executiveSummary", "endorsementScore", "keyCompetencies", "recruiterNotes"],
    }
    try:
        return _generate(prompt, schema)
    except Exception as err:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": str(err) or "Failed to generate candidate summary"})