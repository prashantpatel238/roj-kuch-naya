'use client';

import React from 'react';

type QuizQuestion = {
  _id?: string;
  question?: string;
  title?: string;
  options?: string[];
};

type QuizQuestionWithAnswer = QuizQuestion & {
  correctAnswer?: string;
};

export default function QuizPage() {
  const [questions, setQuestions] = React.useState([] as QuizQuestion[]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null as string | null);
  const [score, setScore] = React.useState(0);
  const [answers, setAnswers] = React.useState([] as (string | null)[]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null as string | null);

  const isFinished = questions.length > 0 && currentIndex >= questions.length;

  React.useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch('/api/quiz');

        if (!response.ok) {
          throw new Error('Unable to load quiz questions.');
        }

        const data = (await response.json()) as { success?: boolean; questions?: QuizQuestionWithAnswer[] };
        const fetched = Array.isArray(data?.questions) ? data.questions : [];

        setQuestions(
          fetched.map((item) => ({
            _id: item._id,
            question: item.question,
            title: item.title,
            options: Array.isArray(item.options) ? item.options.slice(0, 4) : []
          }))
        );
        setAnswers(fetched.map((item) => (typeof item.correctAnswer === 'string' ? item.correctAnswer : null)));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load quiz.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadQuiz();
  }, []);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex] ?? null;
  const currentOptions = Array.isArray(currentQuestion?.options) ? currentQuestion.options : [];

  const handleNext = () => {
    if (!selectedOption || !currentQuestion) {
      return;
    }

    if (currentAnswer && selectedOption === currentAnswer) {
      setScore((prev: number) => prev + 1);
    }

    setSelectedOption(null);
    setCurrentIndex((prev: number) => prev + 1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Quiz</h1>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-600">Loading...</p>
        ) : error ? (
          <p className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : questions.length === 0 ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No quiz questions found.
          </p>
        ) : isFinished ? (
          <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-slate-900">Quiz Result</h2>
            <p className="text-sm text-slate-700">Total score: {score}</p>
            <p className="text-sm text-slate-700">Total questions: {totalQuestions}</p>
            <p className="text-sm font-medium text-slate-900">Percentage: {percentage}%</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              {currentQuestion?.question ?? currentQuestion?.title ?? 'Question unavailable'}
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {currentOptions.map((option: string, index: number) => {
                const isSelected = selectedOption === option;

                return (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() => setSelectedOption(option)}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedOption}
              className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
