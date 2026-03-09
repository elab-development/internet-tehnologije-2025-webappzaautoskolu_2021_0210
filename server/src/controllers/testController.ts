import { Response } from "express";
import { Candidate } from "../models/Candidate";
import { Test } from "../models/Test";
import { TestResult } from "../models/TestResult";
import { AuthRequest } from "../types/AuthRequest";

type QuestionInput = {
  text?: string;
  options?: string[];
  correctOption?: number;
};

const getCandidateFromUser = async (userId: string) => {
  return Candidate.findOne({ user: userId });
};

const isValidTitle = (value: unknown) => {
  const title = String(value ?? "").trim();
  return Boolean(title) && title.toLowerCase() !== "undefined";
};

const toSummary = (test: any) => ({
  _id: String(test._id),
  title: String(test.get("title") ?? ""),
  description: String(test.get("description") ?? ""),
  questionCount: Array.isArray(test.get("questions")) ? test.get("questions").length : 0,
});

export const getAvailableTests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidate = await getCandidateFromUser(req.user.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const tests = await Test.find({ isActive: true }).sort({ createdAt: -1 });
    const payload = tests.filter((test) => isValidTitle(test.get("title"))).map(toSummary);

    return res.json(payload);
  } catch {
    return res.status(500).json({ message: "Failed to fetch tests" });
  }
};

export const getTestById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidate = await getCandidateFromUser(req.user.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const test = await Test.findOne({ _id: req.params.id, isActive: true });
    if (!test || !isValidTitle(test.get("title"))) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = (Array.isArray(test.get("questions")) ? test.get("questions") : []).map(
      (question: any, index: number) => ({
        index,
        text: String(question.text ?? ""),
        options: Array.isArray(question.options)
          ? question.options.map((option: string) => String(option))
          : [],
      })
    );

    return res.json({
      _id: String(test._id),
      title: String(test.get("title")),
      description: String(test.get("description") ?? ""),
      questions,
    });
  } catch {
    return res.status(400).json({ message: "Invalid test ID" });
  }
};

export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidate = await getCandidateFromUser(req.user.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const { testId, answers } = req.body as {
      testId?: string;
      answers?: number[];
    };

    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "testId and answers are required" });
    }

    const test = await Test.findOne({ _id: testId, isActive: true });
    if (!test || !isValidTitle(test.get("title"))) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = Array.isArray(test.get("questions")) ? test.get("questions") : [];

    if (answers.length !== questions.length) {
      return res.status(400).json({ message: "All questions must be answered" });
    }

    let score = 0;

    const normalizedAnswers = questions.map((question: any, index: number) => {
      const selectedOptionRaw = answers[index];
      const selectedOption = Number.isInteger(selectedOptionRaw) ? selectedOptionRaw : -1;
      const correctOption = Number(question.correctOption);
      const isCorrect = selectedOption === correctOption;

      if (isCorrect) {
        score += 1;
      }

      return {
        questionIndex: index,
        selectedOption,
        isCorrect,
      };
    });

    const maxScore = questions.length;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const result = await TestResult.create({
      candidate: candidate._id,
      test: test._id,
      answers: normalizedAnswers,
      score,
      maxScore,
      percentage,
    });

    return res.status(201).json({
      _id: String(result._id),
      testId: String(test._id),
      score,
      maxScore,
      percentage,
      createdAt: result.createdAt,
    });
  } catch {
    return res.status(500).json({ message: "Failed to submit test" });
  }
};

export const getMyTestResults = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidate = await getCandidateFromUser(req.user.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const results = await TestResult.find({ candidate: candidate._id })
      .sort({ createdAt: -1 })
      .populate("test", "title");

    const payload = results.map((result: any) => ({
      _id: String(result._id),
      score: Number(result.score),
      maxScore: Number(result.maxScore),
      percentage: Number(result.percentage),
      createdAt: result.createdAt,
      test: {
        _id: String(result.test?._id ?? ""),
        title: String(result.test?.title ?? "Nepoznat test"),
      },
    }));

    return res.json(payload);
  } catch {
    return res.status(500).json({ message: "Failed to fetch test results" });
  }
};

export const getAllTestsAdmin = async (_req: AuthRequest, res: Response) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });

    const payload = tests
      .filter((test) => isValidTitle(test.get("title")))
      .map((test) => ({
        ...toSummary(test),
        isActive: Boolean(test.get("isActive")),
        createdAt: test.createdAt,
      }));

    return res.json(payload);
  } catch {
    return res.status(500).json({ message: "Failed to fetch all tests" });
  }
};

export const createTestAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, questions } = req.body as {
      title?: string;
      description?: string;
      questions?: QuestionInput[];
    };

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: "Title is required (min 3 chars)" });
    }

    if (title.trim().toLowerCase() === "undefined") {
      return res.status(400).json({ message: "Title cannot be 'undefined'" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    const normalizedQuestions = questions.map((question, index) => {
      const text = String(question.text ?? "").trim();
      const options = Array.isArray(question.options)
        ? question.options.map((option) => String(option).trim()).filter(Boolean)
        : [];
      const correctOption = Number(question.correctOption);

      if (!text) {
        throw new Error(`Question ${index + 1}: text is required`);
      }

      if (options.length < 2) {
        throw new Error(`Question ${index + 1}: at least 2 options are required`);
      }

      if (!Number.isInteger(correctOption) || correctOption < 0 || correctOption >= options.length) {
        throw new Error(`Question ${index + 1}: correct option index is invalid`);
      }

      return { text, options, correctOption };
    });

    const test = await Test.create({
      title: title.trim(),
      description: String(description ?? "").trim(),
      questions: normalizedQuestions,
      isActive: true,
    });

    return res.status(201).json({
      _id: String(test._id),
      title: String(test.get("title")),
      description: String(test.get("description") ?? ""),
      questionCount: normalizedQuestions.length,
      isActive: true,
      createdAt: test.createdAt,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Failed to create test" });
  }
};

export const updateTestStatusAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { isActive } = req.body as { isActive?: boolean };

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive boolean is required" });
    }

    const updated = await Test.findByIdAndUpdate(req.params.id, { isActive }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Test not found" });
    }

    return res.json({
      _id: String(updated._id),
      title: String(updated.get("title")),
      isActive: Boolean(updated.get("isActive")),
    });
  } catch {
    return res.status(400).json({ message: "Invalid test ID" });
  }
};

export const deleteTestAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    await TestResult.deleteMany({ test: test._id });

    return res.json({ message: "Test deleted" });
  } catch {
    return res.status(400).json({ message: "Invalid test ID" });
  }
};

export const cleanupInvalidTestsAdmin = async (_req: AuthRequest, res: Response) => {
  try {
    const invalidTests = await Test.find({
      $or: [
        { title: { $exists: false } },
        { title: null },
        { title: "" },
        { title: "undefined" },
        { title: "Undefined" },
      ],
    }).select("_id");

    const ids = invalidTests.map((t: any) => t._id);

    if (!ids.length) {
      return res.json({ deletedTests: 0, deletedResults: 0 });
    }

    const [{ deletedCount: deletedTests = 0 }, { deletedCount: deletedResults = 0 }] = await Promise.all([
      Test.deleteMany({ _id: { $in: ids } }),
      TestResult.deleteMany({ test: { $in: ids } }),
    ]);

    return res.json({ deletedTests, deletedResults });
  } catch {
    return res.status(500).json({ message: "Failed to cleanup invalid tests" });
  }
};
