import React, { useState } from 'react';
import { ProjectSquad, ProjectSquadTask, Student } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Calendar, 
  Check, 
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';

interface TeamSquadsProgressViewProps {
  squads: ProjectSquad[];
  currentUser: Student;
  onUpdateTaskStatus: (squadId: string, taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => void;
  onAddProjectSquad: (squad: ProjectSquad) => void;
}

export const TeamSquadsProgressView: React.FC<TeamSquadsProgressViewProps> = ({
  squads,
  currentUser,
  onUpdateTaskStatus,
  onAddProjectSquad
}) => {
  const [activeSquadId, setActiveSquadId] = useState<string>(squads[0]?.id || '');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser.name);
  const [newTaskRole, setNewTaskRole] = useState('Full-Stack Dev');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Oct 30');

  const activeSquad = squads.find(s => s.id === activeSquadId) || squads[0];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeSquad) return;

    const newTask: ProjectSquadTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignedTo: newTaskAssignee,
      assignedAvatar: currentUser.avatar,
      role: newTaskRole,
      status: 'todo',
      dueDate: newTaskDueDate
    };

    const updatedTasks = [...activeSquad.tasks, newTask];
    const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);

    // Update squad locally in parent state if desired or pass handler. We simulate mutation:
    activeSquad.tasks = updatedTasks;
    activeSquad.progressPercentage = progress;

    setNewTaskTitle('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 mb-2">
            <Users className="w-3.5 h-3.5" />
            Project Squads & Milestone Progress
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100">
            Who Gets What Part & Progress Tracking
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Coordinate shared projects, delegate responsibilities across roles, and track live completion data toward milestone deliveries.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Task / Responsibility
        </button>
      </div>

      {/* Squad Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
        {squads.map(squad => (
          <button
            key={squad.id}
            onClick={() => setActiveSquadId(squad.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-left border transition-all shrink-0 cursor-pointer ${
              activeSquadId === squad.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              {squad.projectTitle.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-xs line-clamp-1">{squad.projectTitle}</h4>
              <span className="text-[11px] opacity-80">{squad.progressPercentage}% complete</span>
            </div>
          </button>
        ))}
      </div>

      {activeSquad && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Task Assignment Matrix & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                    {activeSquad.phase} Phase
                  </span>
                  <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mt-2">
                    {activeSquad.projectTitle}
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {activeSquad.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                    {activeSquad.progressPercentage}%
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">Progress Data</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${activeSquad.progressPercentage}%` }}
                />
              </div>

              {/* Team Members / Role Division */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Role Division:</span>
                  <div className="flex -space-x-2">
                    {activeSquad.members.map((m, idx) => (
                      <img
                        key={idx}
                        src={m.avatar}
                        alt={m.name}
                        title={`${m.name} (${m.role})`}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-zinc-900"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{activeSquad.members.length} Squad Members Assigned</span>
                </div>
              </div>
            </div>

            {/* Task Assignment Matrix ("Who gets what part") */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Task & Responsibility Matrix
                  </h3>
                  <p className="text-xs text-zinc-500">Who is building what part of the project</p>
                </div>
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>

              <div className="space-y-3">
                {activeSquad.tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => {
                          const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
                          onUpdateTaskStatus(activeSquad.id, task.id, nextStatus);
                        }}
                        className="w-4 h-4 mt-1 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <h4 className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                            {task.role}
                          </span>
                          <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Due {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignedAvatar}
                          alt={task.assignedTo}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {task.assignedTo.split(' ')[0]}
                        </span>
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) => onUpdateTaskStatus(activeSquad.id, task.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border outline-hidden cursor-pointer ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
                            : task.status === 'in-progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Milestones & Team Directory */}
          <div className="space-y-6">
            {/* Milestones Timeline */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                Project Milestones
              </h3>
              <p className="text-xs text-zinc-500">Key delivery gates for this squad</p>

              <div className="space-y-4 pt-2">
                {activeSquad.milestones.map((m, idx) => (
                  <div key={m.id} className="flex items-start gap-3.5 relative">
                    {idx < activeSquad.milestones.length - 1 && (
                      <div className="absolute left-3.5 top-7 bottom-[-16px] w-0.5 bg-zinc-200 dark:bg-zinc-800" />
                    )}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      m.completed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-700'
                    }`}>
                      {m.completed ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <h4 className={`font-semibold text-xs ${m.completed ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {m.title}
                      </h4>
                      <span className="text-[11px] text-zinc-500">Target: {m.targetDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Squad Members Directory */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                Squad Members & Roles
              </h3>

              <div className="space-y-3">
                {activeSquad.members.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{member.name}</h4>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400">{member.role}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-lg">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Assign New Project Task
              </h3>
              <button 
                onClick={() => setShowNewTaskModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Task Title & Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Implement OAuth login route"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Assignee Name
                </label>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
                >
                  {activeSquad?.members.map((m, idx) => (
                    <option key={idx} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Role / Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Backend Lead"
                  value={newTaskRole}
                  onChange={e => setNewTaskRole(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nov 01"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
