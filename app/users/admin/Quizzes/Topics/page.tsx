"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toast, Toaster } from 'react-hot-toast'; 

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    topicId: number;
    createdAt?: string;
    updatedAt?: string;
}

interface Field {
    id: number;
    name: string;
}

interface Topic {
    id: number;
    name: string;
    field_id: number;
    questions: Question[];
    createdAt?: string;
    updatedAt?: string;
    field?: { id: number; name: string };
}

interface APIResponse {
    statusCode: number;
    data: Topic[];
    message: string;
}

const FormModal = ({ item, isOpen, onClose, onSubmit, token, mode = 'add', existingTopics = [] }: {
    item?: Topic;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: Topic) => void;
    token: string;
    mode?: 'add' | 'edit';
    existingTopics?: Topic[];
}) => {
    const [name, setName] = useState(item?.name || '');
    const [selectedFieldId, setSelectedFieldId] = useState(item?.field_id || '');
    const [fields, setFields] = useState<Field[]>([]);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await fetch('http://localhost:5000/fields', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    setFields(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch fields:', error);
                toast.error('Failed to load fields');
            }
        };
        fetchFields();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            if (!selectedFieldId) {
                setError('Please select a field');
                toast.error('Please select a field');
                setProcessing(false);
                return;
            }

            const isDuplicate = existingTopics.some(topic =>
                topic.name.toLowerCase() === name.toLowerCase() &&
                (!item || topic.id !== item.id)
            );

            if (isDuplicate) {
                setError('Topic name already exists');
                toast.error('Topic name already exists');
                setProcessing(false);
                return;
            }

            const url = mode === 'edit'
                ? `http://localhost:5000/topics/${item?.id}`
                : 'http://localhost:5000/topics';

            const method = mode === 'edit' ? 'PATCH' : 'POST';
            const body = {
                name,
                field_id: Number(selectedFieldId)
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
                const newTopic = {
                    ...result.data,
                    field: fields.find(f => f.id === Number(selectedFieldId))
                };
                onSubmit(newTopic);
                onClose();
                toast.success(`Topic ${mode === 'edit' ? 'updated' : 'created'} successfully`);
            } else {
                throw new Error(`Failed to ${mode} topic`);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">
                    {mode === 'edit' ? 'Edit Topic' : 'Add New Topic'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                        <select
                            value={selectedFieldId}
                            onChange={(e) => setSelectedFieldId(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select a field</option>
                            {fields.map((field) => (
                                <option key={field.id} value={field.id}>
                                    {field.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter topic name"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    
                    <div className="flex justify-end gap-2">
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
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
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

        const fetchTopics = async () => {
            try {
                setError(null);
                const [topicsResponse, fieldsResponse] = await Promise.all([
                    fetch('http://localhost:5000/topics', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    fetch('http://localhost:5000/fields', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);

                if (topicsResponse.ok && fieldsResponse.ok) {
                    const topicsData = await topicsResponse.json();
                    const fieldsData = await fieldsResponse.json();
                    
                    // Attach field information to each topic
                    const topicsWithFields = topicsData.data.map((topic: Topic) => ({
                        ...topic,
                        field: fieldsData.data.find((field: Field) => field.id === topic.field_id)
                    }));
                    
                    setTopics(topicsWithFields);
                }
            } catch (error) {
                setError('Failed to fetch topics');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchTopics();
        }
    }, [token, router, user?.role]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setError(null);
                const response = await fetch('http://localhost:5000/topics', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const responseData: APIResponse = await response.json();
                    setTopics(responseData.data);
                }
            } catch (error) {
                setError('Failed to fetch topics');
            }
        };

        if (token) {
            fetchTopics();
        }
    }, [token]); // This will run when the component mounts

    const handleUpdateTopic = (updatedTopic: Topic) => {
        setTopics(topics.map(topic =>
            topic.id === updatedTopic.id ? updatedTopic : topic
        ));
    };

    const handleAddTopic = (newTopic: Topic) => {
        setTopics(prevTopics => [...prevTopics, newTopic]);
    };

    const handleDeleteTopic = async (topicId: number) => {
        toast((t:Toast) => (
            <div className="flex flex-col gap-2 text-center">
                <p>This action will permanently remove this topic and its questions. Are you sure?</p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-3 py-2 bg-red-500 text-white rounded-md text-sm"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const response = await fetch(`http://localhost:5000/topics/${topicId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (response.ok) {
                                    setTopics(topics.filter(topic => topic.id !== topicId));
                                    toast.success('Topic deleted successfully');
                                } else {
                                    toast.error('Failed to delete topic');
                                }
                            } catch (error) {
                                console.error('Delete error:', error);
                                toast.error('Something went wrong while deleting the topic');
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
        ), {
            duration: 6000,
            position: 'top-center',
        });
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
                        <h1 className="text-3xl font-bold text-zinc-800">Topics Overview</h1>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add a New Topic
                        </button>
                    </div>

                    {topics.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-800 mb-4">No Topics Available</h3>
                                <p className="text-zinc-500 mb-8">Start by adding a new topic</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                                >
                                    Add a New Topic
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Topic Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Associated Field
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Questions Count
                                        </th>
                                        <th scope="col" className="relative px-6 py-3 text-center" colSpan={3}>
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {topics.map((topic) => (
                                        <tr key={topic.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-zinc-900">{topic.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-500">{topic.field?.name || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-500">
                                                    {new Date(topic.createdAt || '').toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-500">{topic.questions?.length || 0}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setEditingTopic(topic)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/users/admin/Quizzes/Questions?topic=${topic.id}`}>
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        Manage Questions
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteTopic(topic.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {isAddModalOpen && (
                <FormModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddTopic}
                    token={token || ''}
                    existingTopics={topics}
                />
            )}
            {editingTopic && (
                <FormModal
                    item={editingTopic}
                    isOpen={!!editingTopic}
                    onClose={() => setEditingTopic(null)}
                    onSubmit={handleUpdateTopic}
                    token={token || ''}
                    mode="edit"
                    existingTopics={topics}
                />
            )}
        </div>
    );
}

export default Page;
