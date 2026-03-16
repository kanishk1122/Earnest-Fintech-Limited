import React from 'react';
import { CheckCircle, Circle, Trash2, Edit2 } from 'lucide-react';
import { Button } from './Button';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  return (
    <div className={`task-card ${task.status === 'COMPLETED' ? 'completed' : ''}`}>
      <div className="task-header">
        <button onClick={() => onToggle(task.id)} className="status-toggle">
          {task.status === 'COMPLETED' ? (
            <CheckCircle className="icon-success" size={24} />
          ) : (
            <Circle className="icon-pending" size={24} />
          )}
        </button>
        <div className="task-content">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
        </div>
      </div>
      
      <div className="task-actions">
        <Button variant="ghost" onClick={() => onEdit(task)}>
          <Edit2 size={18} />
        </Button>
        <Button variant="ghost" onClick={() => onDelete(task.id)} style={{ color: 'var(--danger)' }}>
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};
