"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toaster } from 'react-hot-toast';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    topicId: number;
    createdAt?: string;
    updatedAt?: string;
}

interface APIResponse {
    statusCode: number;
    data: Question[];
    message: string;
}

const FormModal = ({ item, isOpen, onClose, onSubmit, token, mode = 'add', existingQuestions = [] }: {
    item?: Question;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: Question) => void;
    token: string;
    mode?: 'add' | 'edit';
    existingQuestions?: Question[];
}) => {
    const [question, setQuestion] = useState(item?.question || '');
    const [options, setOptions] = useState<string[]>(item?.options || ['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(item?.correctAnswer || '');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        if (options.some(opt => !opt.trim())) {
            setError('All options must be filled');
            toast.error('All options must be filled');
            setProcessing(false);
            return;
        }

        if (!correctAnswer) {
            setError('Please select a correct answer');
            toast.error('Please select a correct answer');
            setProcessing(false);
            return;
        }

        try {
            const url = mode === 'edit'
                ? `http://localhost:5000/question/${item?.id}`
                : 'http://localhost:5000/question';

            const method = mode === 'edit' ? 'PATCH' : 'POST';
            const body = { 
                question, 
                options, 
                correctAnswer,
                topicId: item?.topicId 
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const result = await response.json();
                onSubmit(result.data);
                onClose();
                toast.success(`Question ${mode === 'edit' ? 'updated' : 'created'} successfully`);
            } else {
                setError(`Failed to ${mode} question`);
                toast.error(`Failed to ${mode} question`);
            }
        } catch (error) {
            setError(`An error occurred`);
            toast.error(`An error occurred`);
        } finally {
            setProcessing(false);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[32rem] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {mode === 'edit' ? 'Edit Question' : 'Add New Question'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={3}
                            placeholder="Enter question"
                            required
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={option === correctAnswer}
                                    onChange={() => setCorrectAnswer(option)}
                                    className="h-4 w-4 text-red-600"
                                />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder={`Option ${index + 1}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : mode === 'edit' ? 'Save' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function Page() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/Login');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/Login');
            return;
        }

        const fetchQuestions = async () => {
            try {
                setError(null);
                const response = await fetch('http://localhost:5000/question', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    router.push('/Login');
                    return;
                }

                if (response.ok) {
                    const responseData: APIResponse = await response.json();
                    setQuestions(responseData.data);
                } else {
                    setError('Failed to fetch questions');
                }
            } catch (error) {
                setError('Failed to fetch questions');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [token, router, user?.role]);

    const handleUpdateQuestion = (updatedQuestion: Question) => {
        setQuestions(questions.map(question =>
            question.id === updatedQuestion.id ? updatedQuestion : question
        ));
    };

    const handleAddQuestion = (newQuestion: Question) => {
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    };

    const handleDeleteQuestion = async (questionId: number) => {
        toast((t) => (
            <div className="flex flex-col gap-2 text-center">
                <p>Are you sure you want to delete this question?</p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-3 py-2 bg-red-500 text-white rounded-md text-sm"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const response = await fetch(`http://localhost:5000/question/${questionId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (response.ok) {
                                    setQuestions(questions.filter(q => q.id !== questionId));
                                    toast.success('Question deleted successfully');
                                } else {
                                    toast.error('Failed to delete question');
                                }
                            } catch (error) {
                                toast.error('Something went wrong');
                            }
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className="px-3 py-2 bg-gray-200 text-black rounded-md text-sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-red-100">
                    <div className="text-red-500 flex items-center gap-3 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Error Occurred</span>
                    </div>
                    <p className="text-zinc-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <Toaster position="top-center" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-zinc-800">Questions Overview</h1>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add a New Question
                        </button>
                    </div>

                    {questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-800 mb-4">No Questions Available</h3>
                                <p className="text-zinc-500 mb-8">Start by adding a new question</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                                >
                                    Add a New Question
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="divide-y divide-zinc-200">
                                {questions.map((question) => (
                                    <div key={question.id} className="p-6 hover:bg-zinc-50">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-zinc-900">{question.question}</h3>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setEditingQuestion(question)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="ml-4 space-y-2">
                                            {question.options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-2 rounded ${
                                                        option === question.correctAnswer
                                                            ? 'bg-green-50 text-green-700 font-medium'
                                                            : 'text-zinc-600'
                                                    }`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isAddModalOpen && (
                <FormModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddQuestion}
                    token={token}
                    existingQuestions={questions}
                />
            )}
            {editingQuestion && (
                <FormModal
                    item={editingQuestion}
                    isOpen={!!editingQuestion}
                    onClose={() => setEditingQuestion(null)}
                    onSubmit={handleUpdateQuestion}
                    token={token}
                    mode="edit"
                />
            )}
        </div>
    );
}

export default Page;
