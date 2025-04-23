"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toaster, Toast } from 'react-hot-toast';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    topicId: number;
    createdAt?: string;
    updatedAt?: string;
}

interface Topic {
    id: number;
    name: string;
    fieldId: number;
    questions: Question[];
    createdAt?: string;
    updatedAt?: string;
}

interface Field {
    id: number;
    name: string;
    topics: Topic[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

interface APIResponse {
    statusCode: number;
    data: Field[] | Topic[];
    message: string;
}

const FormModal = ({ item, isOpen, onClose, onSubmit, token, mode = 'add', type = 'Field', fieldId = null, existingFields = [] }: {
    item?: Field | Topic;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: Field | Topic) => void;
    token: string;
    mode?: 'add' | 'edit';
    type?: 'Field' | 'Topic';
    fieldId?: number | null;
    existingFields?: Field[];
}) => {
    const [name, setName] = useState(item?.name || '');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            if (type === 'Field') {
                const isDuplicate = existingFields.some(field =>
                    field.name.toLowerCase() === name.toLowerCase() &&
                    (!item || field.id !== item.id)
                );

                if (isDuplicate) {
                    setError('Field name already exists');
                    toast.error('Field name already exists');
                    setProcessing(false);
                    return;
                }
            }

            const baseUrl = type === 'Field' ? 'fields' : 'topics';
            const url = mode === 'edit'
                ? `http://localhost:5000/${baseUrl}/${item?.id}`
                : `http://localhost:5000/${baseUrl}`;

            const method = mode === 'edit' ? 'PATCH' : 'POST';
            const body = type === 'Field'
                ? { name }
                : { name, fieldId: fieldId };

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
                toast.success(`${type} ${mode === 'edit' ? 'updated' : 'created'} successfully`);
            } else {
                setError(`Failed to ${mode} ${type}`);
                toast.error(`Failed to ${mode} ${type}`);
            }
        } catch (error) {
            setError(`An error occurred while ${mode}ing`);
            toast.error(`An error occurred`);
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">
                    {mode === 'edit' ? `Edit ${type} Name` : `Add New ${type}`}
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        placeholder={`Enter ${type} name`}
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
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

const QuestionList = ({ questions }: { questions: Question[] }) => {
    return (
        <div className="pl-8 space-y-2">
            {questions.map((question) => (
                <div key={question.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{question.question}</p>
                    <div className="pl-4 mt-2 space-y-1">
                        {question.options.map((option, index) => (
                            <p key={index} className={`text-sm ${option === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                {option}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

    const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const topics = selectedField?.topics || []; 

    const renderTopics = () => {
        return (
            <div className="pl-6 space-y-2">
                {topics.map((topic) => (
                    <div key={topic.id} className="border-l-2 border-gray-200 pl-4">
                        <div
                            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                        >
                            <h3 className="font-medium">{topic.name}</h3>
                            <span>{expandedTopic === topic.id ? '−' : '+'}</span>
                        </div>
                        {expandedTopic === topic.id && <QuestionList questions={topic.questions} />}
                    </div>
                ))}
            </div>
        );
    };

const TopicsModal = ({ field, isOpen, onClose, onTopicDelete, onTopicEdit }: {
    field: Field;
    isOpen: boolean;
    onClose: () => void;
    token: string;
    onTopicDelete: (topicId: number) => void;
    onTopicEdit: (topic: Topic) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[32rem] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Topics in {field.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="divide-y divide-gray-200">
                    {field.topics?.map((topic) => (
                        <div key={topic.id} className="py-3 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onTopicEdit(topic)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onTopicDelete(topic.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function Page() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<Field | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
    const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
    const [selectedField, setSelectedField] = useState<Field | null>(null);

    useEffect(() => {
        if (!token) {
            router.push('/Login');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/Login');
            return;
        }

        const fetchFields = async () => {
            try {
                setError(null);
                const response = await fetch('http://localhost:5000/fields', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    const errorData = await response.json();
                    setError(errorData.message || 'Unauthorized access');
                    router.push('/Login');
                    return;
                }

                if (response.ok) {
                    const responseData: APIResponse = await response.json();
                    setFields(responseData.data as Field[]);
                } else {
                    setError('Failed to fetch fields');
                }
            } catch (error) {
                setError('Failed to fetch fields');
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [token, router, user?.role]);

    const handleUpdateField = (updatedField: Field) => {

        setFields(fields.map(field =>
            field.id === updatedField.id ? updatedField : field
        ));
    };

    const handleAddField = (newField: Field) => {
        setFields(prevFields => [...prevFields, newField]);
    };

    const handleAddTopic = async (topic: Topic) => {
        setFields(prevFields => prevFields.map(field => {
            if (field.id === Number(topic.id)) {
                return {
                    ...field,
                    topics: [...(field.topics || []), topic]
                };
            }
            return field;
        }));
        
        setIsAddTopicModalOpen(false);
        setSelectedFieldId(null);
        toast.success('Topic added successfully');
    };

    const handleDeleteField = async (fieldId: number) => {
        toast((t:Toast) => (
            <div className="flex flex-col gap-2 text-center">
                <p>This action will permanently remove this field along with its associated topics and questions, Are you sure?</p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-3 py-2 bg-red-500 text-white rounded-md text-sm"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const response = await fetch(`http://localhost:5000/fields/${fieldId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (response.ok) {
                                    setFields(fields.filter(field => field.id !== fieldId));
                                    toast.success('Field deleted successfully');
                                } else {
                                    setError('Failed to delete field');
                                    toast.error('Failed to delete field');
                                }
                            } catch (error) {
                                console.error('Delete error:', error);
                                setError('Failed to delete field. Please try again later.');
                                toast.error('Something went wrong while deleting the field');
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

    const handleTopicDelete = async (topicId: number) => {
        toast((t:Toast) => (
            <div className="flex flex-col gap-2 text-center">
                <p>Are you sure you want to delete this topic?</p>
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
                                    setFields(fields.map(field => ({
                                        ...field,
                                        topics: field.topics.filter(t => t.id !== topicId)
                                    })));
                                    toast.success('Topic deleted successfully');
                                } else {
                                    toast.error('Failed to delete topic');
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

    const handleTopicEdit = async (topic: Topic) => {
        setFields(fields.map(field => ({
            ...field,
            topics: field.topics.map(t => 
                t.id === topic.id ? topic : t
            )
        })));
        
        setSelectedField(null); 
        toast.success('Topic updated successfully');
    };

    if (loading) {
        return (
            <Loader />
        );
    }

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
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-zinc-800">Fields Overview</h1>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add a New Field
                        </button>
                    </div>
                    {fields.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-800 mb-4">No Fields Available</h3>
                                <p className="text-zinc-500 mb-8">Start by adding a new field</p>
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
                                    Add a New Field
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-zinc-200">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Field Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Topics Count
                                        </th>
                                        <th scope="col" className="relative px-6 py-3 text-center" colSpan={4}>
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-zinc-200">
                                    {fields.map((field) => (
                                        <tr key={field.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-zinc-900">{field.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-500">{new Date(field.createdAt || '').toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-500">{field.topics?.length || 0}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setEditingField(field)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setSelectedFieldId(field.id);
                                                        setIsAddTopicModalOpen(true);
                                                    }}
                                                    className="text-green-600 hover:text-blue-900"
                                                >
                                                    + Add Topic
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedField(field)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View Topics
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteField(field.id)}
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

            {editingField && (
                <FormModal
                    item={editingField}
                    isOpen={true}
                    onClose={() => setEditingField(null)}
                    onSubmit={(item) => handleUpdateField(item as Field)}
                    token={token || ''}
                    mode="edit"
                    type="Field"
                    existingFields={fields}
                />
            )}
            {isAddModalOpen && (
                <FormModal
                    isOpen={true}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={(item) => handleAddField(item as Field)}
                    token={token || ''}
                    mode="add"
                    type="Field"
                    existingFields={fields}
                />
            )}
            {isAddTopicModalOpen && (
                <FormModal
                    isOpen={true}
                    onClose={() => {
                        setIsAddTopicModalOpen(false);
                        setSelectedFieldId(null);
                    }}
                    onSubmit={(item) => handleAddTopic(item as Topic)}
                    token={token || ''}
                    mode="add"
                    type="Topic"
                    fieldId={selectedFieldId}
                />
            )}
            {selectedField && (
                <TopicsModal
                    field={selectedField}
                    isOpen={!!selectedField}
                    onClose={() => setSelectedField(null)}
                    token={token || ''}
                    onTopicDelete={handleTopicDelete}
                    onTopicEdit={handleTopicEdit}
                />
            )}
        </div>
    );
}

export default Page;
