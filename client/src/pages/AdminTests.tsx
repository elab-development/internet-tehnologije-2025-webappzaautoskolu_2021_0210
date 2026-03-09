import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  cleanupInvalidTestsAdmin,
  createTestAdmin,
  deleteTestAdmin,
  getAllTestsAdmin,
  updateTestStatusAdmin,
  type AdminTestSummary,
} from "../api/tests";

type DraftQuestion = {
  text: string;
  options: string[];
  correctOption: number;
};

const emptyQuestion = (): DraftQuestion => ({
  text: "",
  options: ["", "", "", ""],
  correctOption: 0,
});

function formatDate(value: string) {
  return new Date(value).toLocaleString("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminTests() {
  const [tests, setTests] = useState<AdminTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion()]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTestsAdmin();
      setTests(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri ucitavanju testova");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateQuestionText = (index: number, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text: value };
      return copy;
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const options = [...copy[questionIndex].options];
      options[optionIndex] = value;
      copy[questionIndex] = { ...copy[questionIndex], options };
      return copy;
    });
  };

  const updateCorrectOption = (questionIndex: number, value: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[questionIndex] = { ...copy[questionIndex], correctOption: value };
      return copy;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setQuestions([emptyQuestion()]);
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError(null);

      await createTestAdmin({
        title,
        description,
        questions: questions.map((question) => ({
          text: question.text,
          options: question.options,
          correctOption: question.correctOption,
        })),
      });

      resetForm();
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri kreiranju testa");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (test: AdminTestSummary) => {
    try {
      setError(null);
      const updated = await updateTestStatusAdmin(test._id, !test.isActive);
      setTests((prev) =>
        prev.map((item) =>
          item._id === test._id ? { ...item, isActive: updated.isActive } : item
        )
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri promeni statusa testa");
    }
  };

  const removeTest = async (test: AdminTestSummary) => {
    const ok = confirm(`Obrisi test \"${test.title}\" iz baze?`);
    if (!ok) {
      return;
    }

    try {
      setError(null);
      await deleteTestAdmin(test._id);
      setTests((prev) => prev.filter((item) => item._id !== test._id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri brisanju testa");
    }
  };

  const cleanupInvalid = async () => {
    try {
      setError(null);
      await cleanupInvalidTestsAdmin();
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greska pri ciscenju neispravnih testova");
    }
  };

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Admin - Testovi</h1>

      {error && (
        <div className="text-red-300 bg-red-950/40 border border-red-900 rounded p-3">{error}</div>
      )}

      <Card title="Kreiranje novog testa">
        <div className="space-y-4">
          <Input label="Naziv testa" value={title} onChange={setTitle} placeholder="npr. Teorija nivo 1" />

          <div>
            <label className="block text-sm text-slate-300 mb-1">Opis</label>
            <textarea
              className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500 text-white"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kratak opis testa"
            />
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Pitanje {index + 1}</p>
                  <Button variant="danger" onClick={() => removeQuestion(index)} disabled={questions.length === 1}>
                    Obrisi pitanje
                  </Button>
                </div>

                <Input
                  label="Tekst pitanja"
                  value={question.text}
                  onChange={(value) => updateQuestionText(index, value)}
                  placeholder="Unesi pitanje"
                />

                <div className="grid md:grid-cols-2 gap-3">
                  {question.options.map((option, optionIndex) => (
                    <Input
                      key={optionIndex}
                      label={`Opcija ${optionIndex + 1}`}
                      value={option}
                      onChange={(value) => updateOption(index, optionIndex, value)}
                      placeholder={`Odgovor ${optionIndex + 1}`}
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1">Tacan odgovor</label>
                  <select
                    value={question.correctOption}
                    onChange={(e) => updateCorrectOption(index, Number(e.target.value))}
                    className="rounded bg-slate-900 border border-slate-700 p-2 text-white"
                  >
                    <option value={0}>Opcija 1</option>
                    <option value={1}>Opcija 2</option>
                    <option value={2}>Opcija 3</option>
                    <option value={3}>Opcija 4</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={addQuestion}>Dodaj pitanje</Button>
            <Button onClick={submit} disabled={saving}>{saving ? "Cuvanje..." : "Sacuvaj test"}</Button>
          </div>
        </div>
      </Card>

      <Card title="Postojeci testovi">
        <div className="mb-3">
          <Button variant="secondary" onClick={cleanupInvalid}>Ocisti invalidne (undefined)</Button>
        </div>

        {loading ? (
          <p className="text-slate-300">Ucitavanje...</p>
        ) : tests.length === 0 ? (
          <p className="text-slate-400">Nema testova.</p>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test._id}
                className="border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{test.title}</p>
                  <p className="text-slate-400 text-sm">
                    {test.questionCount} pitanja | {formatDate(test.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "text-xs px-2 py-1 rounded border " +
                      (test.isActive
                        ? "bg-green-600/20 text-green-300 border-green-700/50"
                        : "bg-slate-700 text-slate-300 border-slate-600")
                    }
                  >
                    {test.isActive ? "Aktivan" : "Neaktivan"}
                  </span>
                  <Button variant="secondary" onClick={() => toggleStatus(test)}>
                    {test.isActive ? "Deaktiviraj" : "Aktiviraj"}
                  </Button>
                  <Button variant="danger" onClick={() => removeTest(test)}>
                    Obrisi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
