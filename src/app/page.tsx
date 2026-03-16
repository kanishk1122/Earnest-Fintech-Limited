'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import { Search, Plus, LogOut, Layout, Filter, ChevronLeft, ChevronRight, Loader2, ClipboardList } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', {
        params: { page, search: debouncedSearch, status, limit: 6 }
      });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTasks();
    }
  }, [user, authLoading, router, fetchTasks]);

  // Reset page when search or status changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleCreateOrUpdate = async (taskData: any) => {
    try {
      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, taskData);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', taskData);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <main className="container">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.5rem', 
            borderRadius: '10px' 
          }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: 1 }}>TaskFlow</h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user.name || user.email}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={logout} style={{ padding: '0.5rem 0.75rem' }}>
          <LogOut size={18} />
          <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>Logout</span>
        </Button>
      </header>

      <section className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search tasks by title or description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} style={{ borderRadius: 'var(--radius-lg)' }}>
          <Plus size={18} />
          <span>New Task</span>
        </Button>
      </section>

      <div className="tasks-container" style={{ minHeight: '300px' }}>
        {loading ? (
          <div className="flex-center" style={{ padding: '4rem' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
              />
            ))}
          </div>
        ) : (
          <div className="card flex-center animate-fade-in" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem', background: 'transparent', boxShadow: 'none', border: '2px dashed var(--border)' }}>
            <ClipboardList size={48} color="var(--text-muted)" opacity={0.5} />
            <p style={{ color: 'var(--text-muted)' }}>
              {search || status ? "No tasks match your search." : "Your task list is empty. Click 'New Task' to begin!"}
            </p>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination-container animate-fade-in">
          <div className="pagination-stats">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
          </div>
          <div className="pagination-controls">
            <Button 
              variant="secondary" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              style={{ width: '2.5rem', height: '2.5rem', padding: 0 }}
            >
              <ChevronLeft size={20} />
            </Button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`page-number ${page === num ? 'active' : ''}`}
              >
                {num}
              </button>
            ))}

            <Button 
              variant="secondary" 
              disabled={page === pagination.totalPages} 
              onClick={() => setPage(p => p + 1)}
              style={{ width: '2.5rem', height: '2.5rem', padding: 0 }}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask || undefined}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      />

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
