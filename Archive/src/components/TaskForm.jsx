import React, { useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TASK_TYPES, PRIORITIES, BUG_SEVERITIES } from '../api/mockApi';

const LS_KEY = 'taskFormDraft';

const TaskForm = ({ isOpen, mode, initialData = null, onSubmit, onClose, users = [], projects = [], loading = false }) => {
  const {
    register, handleSubmit, watch, control, reset, setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: initialData || JSON.parse(localStorage.getItem(LS_KEY) || 'null') || {
      title: '', description: '', taskType: 'Feature', priority: 'Medium',
      projectId: '', assigneeId: '', dueDate: '',
      severity: 'Medium', stepsToReproduce: '',
      businessValue: '', acceptanceCriteria: [{ value: '' }],
      currentBehavior: '', proposedBehavior: '',
      researchQuestions: [{ value: '' }], expectedOutcomes: '',
      subtasks: [],
    },
  });

  const taskType = watch('taskType');
  const projectId = watch('projectId');

  const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({ control, name: 'subtasks' });
  const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({ control, name: 'acceptanceCriteria' });
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({ control, name: 'researchQuestions' });

  const availableUsers = projectId
    ? users.filter(u => u.projectIds?.includes(projectId))
    : users;

  // Auto-save to localStorage every 5 seconds
  useEffect(() => {
    if (!isOpen || mode === 'edit') return;
    const sub = watch((data) => {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    });
    return () => sub.unsubscribe();
  }, [watch, isOpen, mode]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        const draft = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
        if (draft) reset(draft);
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = useCallback((data) => {
    const cleaned = { ...data };
    if (data.acceptanceCriteria) cleaned.acceptanceCriteria = data.acceptanceCriteria.map(c => c.value).filter(Boolean);
    if (data.researchQuestions) cleaned.researchQuestions = data.researchQuestions.map(q => q.value).filter(Boolean);
    if (data.subtasks) cleaned.subtasks = data.subtasks.map((s, i) => ({ id: `sub_${i}`, title: s.title, completed: false }));
    onSubmit(cleaned);
  }, [onSubmit]);

  const renderDynamicFields = () => {
    switch (taskType) {
      case 'Bug':
        return (
          <>
            <div className="form-group">
              <label>Severity *</label>
              <select {...register('severity', { required: true })} className="form-control">
                {BUG_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea {...register('stepsToReproduce')} rows={4} className="form-control" placeholder="1. Go to...\n2. Click..."/>
            </div>
          </>
        );
      case 'Feature':
        return (
          <>
            <div className="form-group">
              <label>Business Value</label>
              <textarea {...register('businessValue')} rows={3} className="form-control" placeholder="Why is this feature needed?"/>
            </div>
            <div className="form-group">
              <label>Acceptance Criteria</label>
              {criteriaFields.map((field, i) => (
                <div key={field.id} className="field-array-row">
                  <input {...register(`acceptanceCriteria.${i}.value`)} className="form-control" placeholder={`Criteria ${i + 1}`}/>
                  <button type="button" onClick={() => removeCriteria(i)} className="btn-remove">×</button>
                </div>
              ))}
              <button type="button" onClick={() => appendCriteria({ value: '' })} className="btn-add">+ Add Criteria</button>
            </div>
          </>
        );
      case 'Enhancement':
        return (
          <>
            <div className="form-group">
              <label>Current Behavior</label>
              <textarea {...register('currentBehavior')} rows={3} className="form-control" placeholder="Describe current behavior..."/>
            </div>
            <div className="form-group">
              <label>Proposed Behavior</label>
              <textarea {...register('proposedBehavior')} rows={3} className="form-control" placeholder="Describe proposed behavior..."/>
            </div>
          </>
        );
      case 'Research':
        return (
          <>
            <div className="form-group">
              <label>Research Questions</label>
              {questionFields.map((field, i) => (
                <div key={field.id} className="field-array-row">
                  <input {...register(`researchQuestions.${i}.value`)} className="form-control" placeholder={`Question ${i + 1}`}/>
                  <button type="button" onClick={() => removeQuestion(i)} className="btn-remove">×</button>
                </div>
              ))}
              <button type="button" onClick={() => appendQuestion({ value: '' })} className="btn-add">+ Add Question</button>
            </div>
            <div className="form-group">
              <label>Expected Outcomes</label>
              <textarea {...register('expectedOutcomes')} rows={3} className="form-control" placeholder="What outcomes do you expect?"/>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h2>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="task-form-body">
          <div className="form-group">
            <label>Title *</label>
            <input
              {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
              className={`form-control ${errors.title ? 'error' : ''}`}
              placeholder="Enter task title"
            />
            {errors.title && <span className="error-msg">{errors.title.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Task Type *</label>
              <select {...register('taskType', { required: true })} className="form-control">
                {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <select {...register('priority', { required: true })} className="form-control">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Project</label>
              <select {...register('projectId')} className="form-control">
                <option value="">No Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assignee</label>
              <select {...register('assigneeId')} className="form-control">
                <option value="">Unassigned</option>
                {availableUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register('description', { maxLength: { value: 500, message: 'Max 500 characters' } })}
              className="form-control" rows={3} placeholder="Optional description..."
            />
            {errors.description && <span className="error-msg">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input type="date" {...register('dueDate')} className="form-control"/>
          </div>

          {renderDynamicFields()}

          <div className="form-group">
            <label>Subtasks</label>
            {subtaskFields.map((field, i) => (
              <div key={field.id} className="field-array-row">
                <input {...register(`subtasks.${i}.title`)} className="form-control" placeholder={`Subtask ${i + 1}`}/>
                <button type="button" onClick={() => removeSubtask(i)} className="btn-remove">×</button>
              </div>
            ))}
            <button type="button" onClick={() => appendSubtask({ title: '' })} className="btn-add">+ Add Subtask</button>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
