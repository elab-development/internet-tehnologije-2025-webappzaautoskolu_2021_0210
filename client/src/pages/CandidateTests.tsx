import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  getAvailableTests,
  getTestById,
  submitTest,
  type SubmittedTestResult,
  type TestDetails,
  type TestSummary,
} from "../api/tests";

export default function CandidateTests() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestDetails | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SubmittedTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTest, setLoadingTest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAvailableTests();
        setTests(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Greska pri ucitavanju testova");
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  const startTest = async (testId: string) => {
    try {
      setLoadingTest(true);
      setError(null);
      setResult(null);
      const data = await getTestById(testId);
      setSelectedTest(data);
      setAnswers(Array.from({ length: data.questions.length }, () => -1));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri otvaranju testa");
    } finally {
      setLoadingTest(false);
    }
  };

  const updateAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[questionIndex] = optionIndex;
      return copy;
    });
  };

  const answeredCount = useMemo(() => answers.filter((value) => value >= 0).length, [answers]);

  const submitCurrentTest = async () => {
    if (!selectedTest) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const data = await submitTest(selectedTest._id, answers);
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri slanju odgovora");
    } finally {
      setSubmitting(false);
    }
  };

  const backToList = () => {
    setSelectedTest(null);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  if (loading) {
    return <div className="p-6 text-slate-300">Ucitavanje testova...</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Polaganje teorijskog testa</h1>

      {error && (
        <div className="text-red-300 bg-red-950/40 border border-red-900 rounded p-3">{error}</div>
      )}

      {!selectedTest && (
        <div className="grid md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Card key={test._id} title={test.title}>
              <p className="text-slate-300 text-sm">{test.description || "Bez opisa"}</p>
              <p className="text-slate-400 text-sm mt-2">Broj pitanja: {test.questionCount}</p>
              <div className="mt-4">
                <Button onClick={() => startTest(test._id)} disabled={loadingTest}>
                  {loadingTest ? "Otvaranje..." : "Pokreni test"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!selectedTest && tests.length === 0 && (
        <Card>
          <p className="text-slate-300">Trenutno nema dostupnih testova.</p>
        </Card>
      )}

      {selectedTest && (
        <div className="space-y-4">
          <Card title={selectedTest.title}>
            <p className="text-slate-300">{selectedTest.description || "Teorijski test"}</p>
            <p className="text-slate-400 mt-2">
              Odgovoreno: {answeredCount}/{selectedTest.questions.length}
            </p>
          </Card>

          {selectedTest.questions.map((question, index) => (
            <Card key={question.index} title={`Pitanje ${index + 1}`}>
              <p className="text-slate-200 mb-3">{question.text}</p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center gap-2 text-slate-300">
                    <input
                      type="radio"
                      name={`q-${question.index}`}
                      checked={answers[question.index] === optionIndex}
                      onChange={() => updateAnswer(question.index, optionIndex)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}

          <div className="flex gap-3">
            <Button
              onClick={submitCurrentTest}
              disabled={submitting || answeredCount !== selectedTest.questions.length}
            >
              {submitting ? "Slanje..." : "Posalji odgovore"}
            </Button>
            <Button variant="secondary" onClick={backToList}>
              Nazad na listu testova
            </Button>
          </div>

          {result && (
            <Card title="Rezultat testa">
              <p className="text-lg">Bodovi: {result.score}/{result.maxScore}</p>
              <p className="text-slate-300">Uspeh: {result.percentage}%</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
