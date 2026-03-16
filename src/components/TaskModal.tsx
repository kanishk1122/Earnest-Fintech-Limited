import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface Task {
  id?: string;
  title: string;
  description?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialData?: Task;
  title: string;
}

export const TaskModal = ({ isOpen, onClose, onSubmit, initialData, title }: TaskModalProps) => {
  const [taskData, setTaskData] = useState<Task>({ title: '', description: '' });

  useEffect(() => {
    if (initialData) {
      setTaskData({ title: initialData.title, description: initialData.description || '' });
    } else {
      setTaskData({ title: '', description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="card modal-content animate-fade-in" style={{ maxWidth: '500px', width: '90%' }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" onClick={onClose} style={{ padding: '0.5rem' }}>
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(taskData); }}>
          <Input 
            label="Task Title" 
            placeholder="What needs to be done?" 
            required 
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          />
          <div className="input-group">
            <label>Description (Optional)</label>
            <textarea 
              placeholder="Add more details..."
              value={taskData.description || ''}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              style={{ 
                minHeight: '100px', 
                resize: 'vertical',
                width: '100%',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData?.id ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
