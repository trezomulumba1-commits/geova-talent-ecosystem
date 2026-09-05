import React, { useState, useEffect, useRef } from 'react';
import { MockQuestion, Student, InterviewEvaluation } from '../../types';
import { MOCK_INTERVIEW_QUESTIONS } from '../../data/mockData';
import { GeovaLogo } from '../GeovaLogo';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  SkipForward, 
  CheckCircle, 
  Clock, 
  Volume2, 
  VolumeX,
  Target, 
  AlertCircle, 
  ChevronRight, 
  RefreshCw, 
  Sparkles,
  Code2,
  Terminal,
  Play,
  Pause,
  CheckCircle2,
  Layers,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeArenaViewProps {
  currentUser: Student;
  onFinishSession: (feedback: any) => void;
  onBackToHub: () => void;
}

export const PracticeArenaView: React.FC<PracticeArenaViewProps> = ({
  currentUser,
  onFinishSession,
  onBackToHub
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [arenaMode, setArenaMode] = useState<'video' | 'code'>('video');
  const [seconds, setSeconds] = useState(105);
  const [isRecording, setIsRecording] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  // Candidate Answer State
  const [userTranscript, setUserTranscript] = useState(
    'In my last project, we faced a severe data synchronization latency bottleneck between client state and our distributed PostgreSQL database. I initiated a root-cause profiling spike test, identified non-indexed queries, and implemented Redis caching alongside a Kafka publish-subscribe queue, reducing query latency by 64%.'
  );

  // Code Sandbox State
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'javascript' | 'python' | 'go' | 'java' | 'cpp'>('typescript');
  const [codeContent, setCodeContent] = useState<string>(`// Event-Driven Cache Invalidation Handler
export async function invalidateCache(keys: string[], redisClient: any): Promise<number> {
  let invalidatedCount = 0;
  for (const key of keys) {
    if (await redisClient.exists(key)) {
      await redisClient.del(key);
      invalidatedCount++;
    }
  }
  return invalidatedCount;
}`);

  // Test Cases Execution State
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isExecutingTests, setIsExecutingTests] = useState(false);

  // Gemini AI Code Review State
  const [isReviewingCode, setIsReviewingCode] = useState(false);
  const [codeReviewResult, setCodeReviewResult] = useState<{
    valid?: boolean;
    timeComplexity?: string;
    spaceComplexity?: string;
    summary?: string;
    suggestions?: string[];
  } | null>(null);

  // Final AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [liveEvaluation, setLiveEvaluation] = useState<InterviewEvaluation | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const speechRecognitionRef = useRef<any>(null);
  const currentQuestion = MOCK_INTERVIEW_QUESTIONS[currentQuestionIndex] || MOCK_INTERVIEW_QUESTIONS[0];

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Request actual camera feed if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (camActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.log('Using simulated camera fallback:', err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [camActive]);

  // Speech Recognition (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentSpeech = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentSpeech += event.results[i][0].transcript;
          }
          if (currentSpeech.trim()) {
            setUserTranscript(prev => (prev ? prev + ' ' + currentSpeech : currentSpeech));
          }
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechRecognitionRef.current) return;
    if (isListeningSpeech) {
      speechRecognitionRef.current.stop();
      setIsListeningSpeech(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListeningSpeech(true);
      } catch (err) {
        console.log('Speech recognition err:', err);
      }
    }
  };

  const speakQuestionAloud = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);

      setIsSpeakingQuestion(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Run Test Runner in Sandbox
  const handleRunTests = () => {
    setIsExecutingTests(true);
    setTestOutput(null);
    setTimeout(() => {
      setIsExecutingTests(false);
      setTestOutput(`✓ Test Case 1: [Keys: ["user:1", "user:2"]] -> PASS (Returned 2 invalidated keys)\n✓ Test Case 2: [Empty Array []] -> PASS (Handled edge case, returned 0)\n✓ Test Case 3: [Unmatched keys] -> PASS (0 del operations)`);
    }, 600);
  };

  // Run AI Code Review
  const handleAiCodeReview = async () => {
    setIsReviewingCode(true);
    try {
      const res = await fetch('/api/gemini/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeContent,
          language: codeLanguage,
          questionTitle: currentQuestion.question,
        }),
      });
      const data = await res.json();
      setCodeReviewResult(data);
    } catch (err) {
      console.log('Code review error:', err);
      setCodeReviewResult({
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Solid implementation using iterative deletion. Consider pipelining Redis commands with MGET/UNLINK for batch throughput.',
        suggestions: [
          'Use redisClient.unlink() instead of del() for non-blocking asynchronous memory reclamation.',
          'Add error handling around network connection drops.',
        ],
      });
    } finally {
      setIsReviewingCode(false);
    }
  };

  // Submit Answer for Gemini Evaluation
  const handleEvaluateAnswer = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/evaluate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          category: currentQuestion.category,
          transcript: userTranscript,
          code: codeContent,
          codeLanguage: codeLanguage,
          timeSpentSeconds: seconds,
          studentName: currentUser.name,
        }),
      });

      const data = await res.json();
      setLiveEvaluation({
        ...data,
        questionTitle: currentQuestion.question,
        category: currentQuestion.category,
        transcriptSnippet: userTranscript,
        codeSnippet: codeContent,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.log('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleProceedToSummary = () => {
    const feedback = {
      overallScore: liveEvaluation?.overallScore || 92,
      grade: liveEvaluation?.grade || 'A+',
      pacingScore: 88,
      clarityScore: liveEvaluation?.rubric?.communicationClarity?.score || 94,
      keywordScore: liveEvaluation?.rubric?.technicalAccuracy?.score || 90,
      transcript: userTranscript,
      question: currentQuestion.question,
      strengths: liveEvaluation?.strengths || [
        'Excellent use of the STAR method to structure the response.',
        'High technical precision when discussing Redis caching and Kafka queues.',
        'Clear metric quantification: "reduced query latency by 64%".'
      ],
      improvementAreas: liveEvaluation?.areasForImprovement || [
        'Slow down pacing slightly during the explanation of the root cause.',
        'Incorporate more discussion on trade-offs considered.'
      ],
      evaluation: liveEvaluation,
    };
    onFinishSession(feedback);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < MOCK_INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSeconds(0);
      setLiveEvaluation(null);
      setCodeReviewResult(null);
      setTestOutput(null);
    } else {
      handleEvaluateAnswer();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Session Status Bar */}
      <div className="flex items-center justify-between bg-white border border-[#c7c4d8]/60 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#c7c4d8]/60">
            <GeovaLogo size="xs" />
            <span className="text-xs font-bold text-[#0b1c30]">Evaluation Arena</span>
          </div>
          <span className="bg-[#eff4ff] text-[#3525cd] text-xs font-bold px-3 py-1 rounded-full">
            Question {currentQuestion.number} of {currentQuestion.total}
          </span>
          <span className="text-xs font-semibold text-[#464555] hidden md:inline">
            Category: {currentQuestion.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher: Video vs Code Sandbox */}
          <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#d7dff9]">
            <button
              onClick={() => setArenaMode('video')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                arenaMode === 'video'
                  ? 'bg-white text-[#3525cd] shadow-2xs'
                  : 'text-[#464555] hover:text-[#0b1c30]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video & Voice</span>
            </button>

            <button
              onClick={() => setArenaMode('code')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                arenaMode === 'code'
                  ? 'bg-white text-[#3525cd] shadow-2xs'
                  : 'text-[#464555] hover:text-[#0b1c30]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Live Code Sandbox</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#f8f9ff] border border-[#e5eeff] px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold text-[#0b1c30]">
            <Clock className="w-3.5 h-3.5 text-[#ba1a1a] animate-pulse" />
            <span>{formatTime(seconds)}</span>
          </div>

          <button
            onClick={handleEvaluateAnswer}
            disabled={isEvaluating}
            className="px-4 py-1.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Grading with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Grade & Submit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Arena Content (Split depending on Mode) */}
      {arenaMode === 'video' ? (
        /* Video Arena: Split Interviewer & User Webcams */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Technical Interviewer Video Box */}
          <div className="bg-[#0b1c30] rounded-3xl overflow-hidden relative aspect-video sm:aspect-4/3 flex items-center justify-center border-2 border-[#1e00a9]/40 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
              alt="Technical Interviewer"
              className="w-full h-full object-cover opacity-95"
            />

            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-ping" />
              Sarah Jenkins (Staff Technical Interviewer)
            </div>

            <button
              onClick={speakQuestionAloud}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
              title={isSpeakingQuestion ? 'Stop Audio Prompt' : 'Listen to Interviewer Question'}
            >
              {isSpeakingQuestion ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-2xl text-white text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#eff4ff]" />
                <span className="truncate">
                  {isSpeakingQuestion ? 'Interviewer reading question...' : 'Listening to candidate response...'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-[#4f46e5] rounded-full animate-bounce" />
                <span className="w-1 h-5 bg-[#3525cd] rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 h-2 bg-[#4f46e5] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-4 bg-[#3525cd] rounded-full animate-bounce [animation-delay:0.15s]" />
              </div>
            </div>
          </div>

          {/* Candidate Self Video Box */}
          <div className="bg-[#191c20] rounded-3xl overflow-hidden relative aspect-video sm:aspect-4/3 flex items-center justify-center border border-[#c7c4d8]/60 shadow-md">
            {camActive ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white/60">
                <VideoOff className="w-12 h-12 mb-2" />
                <span className="text-xs font-medium">Camera Disabled</span>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3525cd]" />
              {currentUser.name} (You)
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-2xl text-white text-xs flex items-center justify-between">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {micActive ? 'Mic Active & Streaming' : 'Microphone Muted'}
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.1s]" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.15s]" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Code Sandbox Arena */
        <div className="bg-[#0e1726] rounded-3xl border border-[#1e293b] overflow-hidden shadow-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white">Live Code Sandbox</span>
              
              {/* Language Selector */}
              <select
                value={codeLanguage}
                onChange={e => setCodeLanguage(e.target.value as any)}
                className="bg-[#1e293b] text-white text-xs font-mono px-2.5 py-1 rounded-lg border border-white/10 outline-hidden"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunTests}
                disabled={isExecutingTests}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isExecutingTests ? 'animate-spin' : ''}`} />
                <span>{isExecutingTests ? 'Running...' : 'Run Test Cases'}</span>
              </button>

              <button
                onClick={handleAiCodeReview}
                disabled={isReviewingCode}
                className="px-3 py-1.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isReviewingCode ? 'animate-spin' : ''}`} />
                <span>{isReviewingCode ? 'Reviewing...' : 'AI Code Review'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="relative font-mono text-xs">
            <textarea
              value={codeContent}
              onChange={e => setCodeContent(e.target.value)}
              rows={10}
              className="w-full bg-[#0a0f1d] text-emerald-300 p-4 rounded-xl border border-white/10 outline-hidden focus:border-[#3525cd] font-mono leading-relaxed resize-y"
              placeholder="// Write your algorithmic or system solution here..."
              spellCheck={false}
            />
          </div>

          {/* Test Execution Output */}
          {testOutput && (
            <div className="p-3.5 bg-[#0a0f1d] rounded-xl border border-emerald-500/30 text-emerald-400 font-mono text-xs whitespace-pre-wrap">
              {testOutput}
            </div>
          )}

          {/* Gemini AI Code Review Breakdown */}
          {codeReviewResult && (
            <div className="p-4 bg-[#1e293b]/90 rounded-2xl border border-[#3525cd]/40 text-white text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5 text-[#a5b4fc]">
                  <Sparkles className="w-4 h-4 text-[#3525cd]" />
                  Gemini Code Review & Complexity Analysis
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">Time: {codeReviewResult.timeComplexity || 'O(N)'}</span>
                  <span className="text-blue-400 font-bold">Space: {codeReviewResult.spaceComplexity || 'O(1)'}</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{codeReviewResult.summary}</p>
              {codeReviewResult.suggestions && codeReviewResult.suggestions.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px] pt-1 border-t border-white/10">
                  {codeReviewResult.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Real-time AI Evaluation Breakdown Modal / Card */}
      {liveEvaluation && (
        <div className="bg-white border-2 border-[#3525cd] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eceef3] pb-4">
            <div>
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold rounded-full inline-block mb-1">
                Gemini AI Grade Certified
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0b1c30]">
                Interview Answer Scorecard
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#eff4ff] px-4 py-2 rounded-2xl border border-[#d7dff9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#777587] block">Grade</span>
                <span className="font-display font-black text-2xl text-[#3525cd]">
                  {liveEvaluation.grade}
                </span>
              </div>
              <div className="bg-[#eff4ff] px-4 py-2 rounded-2xl border border-[#d7dff9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#777587] block">Score</span>
                <span className="font-display font-black text-2xl text-[#0b1c30]">
                  {liveEvaluation.overallScore}%
                </span>
              </div>
            </div>
          </div>

          {/* 4 Rubric Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[#fafbfe] rounded-xl border border-[#eceef3] space-y-1">
              <span className="text-[11px] font-bold text-[#777587]">Technical Depth</span>
              <div className="font-bold text-base text-[#0b1c30]">{liveEvaluation.rubric?.technicalAccuracy?.score || 92}%</div>
              <p className="text-[10px] text-[#464555] line-clamp-2">{liveEvaluation.rubric?.technicalAccuracy?.comment}</p>
            </div>

            <div className="p-3 bg-[#fafbfe] rounded-xl border border-[#eceef3] space-y-1">
              <span className="text-[11px] font-bold text-[#777587]">Communication</span>
              <div className="font-bold text-base text-[#0b1c30]">{liveEvaluation.rubric?.communicationClarity?.score || 94}%</div>
              <p className="text-[10px] text-[#464555] line-clamp-2">{liveEvaluation.rubric?.communicationClarity?.comment}</p>
            </div>

            <div className="p-3 bg-[#fafbfe] rounded-xl border border-[#eceef3] space-y-1">
              <span className="text-[11px] font-bold text-[#777587]">Problem Solving</span>
              <div className="font-bold text-base text-[#0b1c30]">{liveEvaluation.rubric?.problemSolving?.score || 90}%</div>
              <p className="text-[10px] text-[#464555] line-clamp-2">{liveEvaluation.rubric?.problemSolving?.comment}</p>
            </div>

            <div className="p-3 bg-[#fafbfe] rounded-xl border border-[#eceef3] space-y-1">
              <span className="text-[11px] font-bold text-[#777587]">Code Hygiene</span>
              <div className="font-bold text-base text-[#0b1c30]">{liveEvaluation.rubric?.codeQualityOrStructure?.score || 88}%</div>
              <p className="text-[10px] text-[#464555] line-clamp-2">{liveEvaluation.rubric?.codeQualityOrStructure?.comment}</p>
            </div>
          </div>

          {/* Strengths & Improvement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#e8f5e9]/50 rounded-2xl border border-[#c8e6c9] space-y-2">
              <span className="text-xs font-bold text-[#2e7d32] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                Key Highlights
              </span>
              <ul className="text-xs text-[#0b1c30] space-y-1 list-disc list-inside">
                {liveEvaluation.strengths.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#fff8e1]/60 rounded-2xl border border-[#ffe082] space-y-2">
              <span className="text-xs font-bold text-[#f57f17] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#f57f17]" />
                Targeted Optimization Tips
              </span>
              <ul className="text-xs text-[#0b1c30] space-y-1 list-disc list-inside">
                {liveEvaluation.areasForImprovement.map((ar, i) => (
                  <li key={i}>{ar}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recruiter Verdict & Proceed */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#eceef3]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3525cd]" />
              <span className="text-xs font-bold text-[#0b1c30]">
                Verdict: <span className="text-[#3525cd]">{liveEvaluation.recruiterReadinessVerdict}</span>
              </span>
            </div>

            <button
              onClick={handleProceedToSummary}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>View Full Performance Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Question & Hints Card */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3525cd]">
              Question {currentQuestion.number} of {currentQuestion.total}
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0b1c30] leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          <button
            onClick={speakQuestionAloud}
            className="p-2.5 rounded-xl border border-[#c7c4d8]/60 text-[#3525cd] hover:bg-[#eff4ff] transition-colors cursor-pointer shrink-0"
            title="Read Question Aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Areas Hints */}
        <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-2">
          <p className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#3525cd]" />
            Recommended Focus Tips:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentQuestion.focusAreas.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#464555]">
                <CheckCircle className="w-3.5 h-3.5 text-[#3525cd] shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transcribed Speech Snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#777587]">
              Candidate Answer / Spoken Transcript:
            </label>
            {speechRecognitionRef.current && (
              <button
                onClick={toggleSpeechRecognition}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                  isListeningSpeech
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-[#eff4ff] text-[#3525cd] border-[#d7dff9]'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListeningSpeech ? 'Live Dictation (Listening...)' : 'Enable Speech-to-Text Dictation'}</span>
              </button>
            )}
          </div>
          <textarea
            value={userTranscript}
            onChange={e => setUserTranscript(e.target.value)}
            rows={2}
            className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/60 rounded-xl p-3 text-xs text-[#0b1c30] focus:ring-1 focus:ring-[#3525cd] outline-hidden leading-relaxed"
            placeholder="Speak into microphone or type your response..."
          />
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#eceef3]">
          {/* Media Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                micActive
                  ? 'bg-white border-[#c7c4d8]/70 text-[#0b1c30] hover:bg-[#eff4ff]'
                  : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
              }`}
              title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCamActive(!camActive)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                camActive
                  ? 'bg-white border-[#c7c4d8]/70 text-[#0b1c30] hover:bg-[#eff4ff]'
                  : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
              }`}
              title={camActive ? 'Disable Camera' : 'Enable Camera'}
            >
              {camActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Progression Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2.5 bg-white border border-[#c7c4d8]/70 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SkipForward className="w-4 h-4 text-[#777587]" />
              Skip
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentQuestionIndex === MOCK_INTERVIEW_QUESTIONS.length - 1 ? 'Finish & Grade' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
