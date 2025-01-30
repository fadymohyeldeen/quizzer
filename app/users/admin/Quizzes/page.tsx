"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toaster } from 'react-hot-toast';

interface Field {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

interface Topic {
    id: number;
    name: string;
    fieldId: number;
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });


                if (response.status === 401) {
                    const errorData = await response.json();
                    console.error('Auth error:', errorData); 
                    setError(errorData.message || 'Unauthorized access');
                    router.push('/Login');
                    return;
                }

                if (response.ok) {
                    const responseData: APIResponse = await response.json();
                    console.log('Received data:', responseData);

                    if (responseData.data && Array.isArray(responseData.data)) {
                        setFields(responseData.data); 
                    } else {
                        console.error('Invalid data format:', responseData);
                        setError('Invalid data format received');
                        setFields([]);
                    }
                } else {
                    console.error('API Error:', response.statusText);
                    setError(`Failed to fetch fields: ${response.statusText}`);
                    setFields([]);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to fetch fields. Please try again later.');
                setFields([]);
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
        router.push(`/users/admin/Quizzes/Topics/${topic.fieldId}`);
    };

    const handleDeleteField = async (fieldId: number) => {
        toast((t) => (
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
                            Add New Field
                        </button>
                    </div>
                    {fields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-8 py-16">
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-800 mb-4">No Fields Available</h3>
                                <p className="text-zinc-500 mb-8">Start by creating your first field to manage quizzes</p>
                                <Link href="/users/admin/Quizzes/AddField">
                                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
                                        Create First Field
                                    </button>
                                </Link>
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
                                                <Link href={`/users/admin/Quizzes/Topics/${field.id}`}>
                                                    <button className="text-blue-600 hover:text-blue-900">View Topics</button>
                                                </Link>
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
                    onSubmit={handleUpdateField}
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
                    onSubmit={handleAddField}
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
                    onSubmit={handleAddTopic}
                    token={token || ''}
                    mode="add"
                    type="Topic"
                    fieldId={selectedFieldId}
                />
            )}
        </div>
    );
}

export default Page;
