"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BiCategory } from 'react-icons/bi'
import { MdOutlineTopic } from 'react-icons/md'
import { BsQuestionLg } from 'react-icons/bs'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<{
    fields: number;
    topics: number;
    questions: number;
    questionsPerField: {
      labels: string[];
      data: number[];
    };
  }>({
    fields: 0,
    topics: 0,
    questions: 0,
    questionsPerField: {
      labels: [],
      data: []
    }
  });

  React.useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/Login');
    }
  }, [user, router]);

  const cards = [
    {
      title: 'Fields',
      description: 'Manage quiz fields and categories',
      icon: <BiCategory size={24} />,
      addLink: '/users/admin/Quizzes/Fields',
      viewLink: '/users/admin/Quizzes/Fields'
    },
    {
      title: 'Topics',
      description: 'Manage topics within fields',
      icon: <MdOutlineTopic size={24} />,
      addLink: '/users/admin/Quizzes/Topics',
      viewLink: '/users/admin/Quizzes/Topics'
    },
    {
      title: 'Questions',
      description: 'Manage quiz questions',
      icon: <BsQuestionLg size={24} />,
      addLink: '/users/admin/Quizzes/Questions',
      viewLink: '/users/admin/Quizzes/Questions'
    }
  ];

  const barChartData = {
    labels: ['Fields', 'Topics', 'Questions'],
    datasets: [
      {
        label: 'Total Count',
        data: [analytics.fields, analytics.topics, analytics.questions],
        backgroundColor: ['rgba(239, 68, 68, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)'],
      },
    ],
  }

  const pieChartData = {
    labels: analytics.questionsPerField.labels,
    datasets: [
      {
        data: analytics.questionsPerField.data,
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(251, 191, 36, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
      },
    ],
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
       
        setAnalytics({
          fields: 5,
          topics: 15,
          questions: 50,
          questionsPerField: {
            labels: ['Science', 'Math', 'History', 'Literature', 'Arts'],
            data: [20, 10, 8, 7, 5]
          }
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-800 mb-8">Quiz Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold text-zinc-800">{card.title}</h2>
              </div>
              <p className="text-zinc-600 mb-6">{card.description}</p>
              <div className="flex gap-4">
                <Link href={card.addLink} className="flex-1">
                  <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200">
                    Add {card.title}
                  </button>
                </Link>
                <Link href={card.viewLink} className="flex-1">
                  <button className="w-full bg-zinc-100 text-zinc-800 py-2 px-4 rounded-lg hover:bg-zinc-200 transition-colors duration-200">
                    View {card.title}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-zinc-800 mb-6">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Content Distribution</h3>
              <div className="h-[300px]">
                <Bar 
                  data={barChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              </div>
            </div>
            <div className="bg-zinc-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Questions by Field</h3>
              <div className="h-[300px]">
                <Pie 
                  data={pieChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
