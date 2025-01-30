'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const AddQuizPage: React.FC = () => {
    const { token, user } = useAuth();
    const router = useRouter();
    
    const [field, setField] = useState('');
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(-1);
    const [type] = useState('choose'); 

    const fieldOptions = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
    const topicOptions = {
        'Computer Science': ['Programming', 'Databases', 'Networking', 'AI'],
        'Mathematics': ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
        'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics'],
        'Chemistry': ['Organic', 'Inorganic', 'Physical', 'Analytical'],
        'Biology': ['Genetics', 'Ecology', 'Anatomy', 'Microbiology']
    };

    useEffect(() => {
        if (!token) {
            router.push('/Login');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/users/student/Dashboard');
            return;
        }
    }, [token, router, user?.role]);

    const handleAddQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const questionResponse = await fetch('http://localhost:5000/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: 1,
                    topic_id: 1, 
                    type: type,
                    question: question,
                    answer: answers[correctAnswer] 
                }),
            });

            console.log('Request payload:', {
                user_id: 1,
                topic_id: 1,
                type: type,
                question: question,
                answer: answers[correctAnswer]
            });

            const responseText = await questionResponse.text();
            console.log('Response body:', responseText);

            if (!questionResponse.ok) {
                if (questionResponse.status === 401) {
                    router.push('/Login');
                    return;
                }
                throw new Error(`Failed to add question`);
            }

            const questionData = JSON.parse(responseText);

            const choicesResponse = await fetch('http://localhost:5000/choice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question_id: questionData.id,
                    answer_a: answers[0],
                    answer_b: answers[1],
                    answer_c: answers[2],
                    answer_d: answers[3]
                }),
            });

            if (!choicesResponse.ok) throw new Error('Failed to add choices');

            setField('');
            setTopic('');
            setQuestion('');
            setAnswers(['', '', '', '']);
            setCorrectAnswer(-1);
            alert('Question added successfully!');

        } catch (error) {
            console.error('Error details:', error);
            alert('Failed to add question. Please try again.');
        }
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full p-6 bg-zinc-400 rounded-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Add A New Question</h1>
                <form onSubmit={handleAddQuiz}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Field</label>
                        <select
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select a field</option>
                            {fieldOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Topic</label>
                        <select
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            disabled={!field}
                        >
                            <option value="">Select a topic</option>
                            {field && topicOptions[field as keyof typeof topicOptions].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Answers</label>
                        <div className="space-y-2 mb-4">
                            {answers.map((answer, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder={`A.${index + 1}`}
                                    required
                                />
                            ))}
                        </div>
                        <div className="flex-col text-center">
                            <h1 className='pb-3'>Correct Answer</h1>
                            <div className='flex justify-center space-x-8'>
                                {answers.map((_, index) => (
                                    <div key={index} className="flex items-center gap-2 w-16">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={correctAnswer === index}
                                            onChange={() => setCorrectAnswer(index)}
                                            className="w-4 h-4"
                                            required
                                        />
                                        <span className="text-sm">A.{index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-red-500 text-white p-2 rounded w-full hover:bg-red-600"
                    >
                        Add Question
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddQuizPage;
