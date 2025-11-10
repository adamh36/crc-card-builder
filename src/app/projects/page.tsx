"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, AlertCircle, Loader2, ArrowLeft, Save, X } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Project = {
  _id: string;
  ownerId: string | null;
  name: string;
  description?: string;
  members: { userId: string; role: "owner" | "editor" | "viewer" }[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type Card = {
  _id: string;
  projectId: string;
  className: string;
  responsibilities: string[];
  collaborators: string[];
  attributes: string[];
  methods: string[];
  issueFlags: { category: string; severity: string; message: string }[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

// ============================================================================
// DEMO APP COMPONENT (Simulates routing)
// ============================================================================

export default function CRCCardBuilderApp() {
  const [currentView, setCurrentView] = useState<'projects' | 'project-detail'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigateToProjects = () => {
    setCurrentView('projects');
    setSelectedProjectId(null);
  };

  const navigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigateHome={navigateToProjects} />
      <main>
        {currentView === 'projects' && (
          <ProjectsPage onNavigateToProject={navigateToProject} />
        )}
        {currentView === 'project-detail' && selectedProjectId && (
          <ProjectDetailPage 
            projectId={selectedProjectId} 
            onNavigateBack={navigateToProjects}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <button
          onClick={onNavigateHome}
          className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          CRC Card Builder
        </button>
      </div>
    </header>
  );
}

// ============================================================================
// PROJECTS PAGE
// ============================================================================

function ProjectsPage({ onNavigateToProject }: { onNavigateToProject: (id: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load projects');
      }
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name: string, description: string) => {
    setError(null);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: description || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }
      await loadProjects();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return false;
    }
  };

  const handleUpdateProject = async (id: string, name: string, description: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: description || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }
      await loadProjects();
      setEditingId(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      return false;
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete project');
      }
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">Manage your CRC card projects</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <ProjectForm onSubmit={handleCreateProject} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No projects yet</p>
          <p className="text-gray-400 text-sm mt-2">Create your first project above</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectItem
              key={project._id}
              project={project}
              isEditing={editingId === project._id}
              onEdit={() => setEditingId(project._id)}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              onOpen={onNavigateToProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PROJECT FORM COMPONENT
// ============================================================================

function ProjectForm({ 
  onSubmit, 
  initialName = '', 
  initialDescription = '',
  submitLabel = 'Create Project',
  onCancel 
}: { 
  onSubmit: (name: string, description: string) => Promise<boolean>;
  initialName?: string;
  initialDescription?: string;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const success = await onSubmit(name.trim(), description.trim());
    setSubmitting(false);

    if (success && !onCancel) {
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="grid gap-4">
        <div>
          <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name *
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Design Patterns Project"
            disabled={submitting}
            required
          />
        </div>
        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A collection of CRC cards for analyzing system design..."
            rows={3}
            disabled={submitting}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

// ============================================================================
// PROJECT ITEM COMPONENT
// ============================================================================

function ProjectItem({
  project,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onOpen,
}: {
  project: Project;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, name: string, description: string) => Promise<boolean>;
  onDelete: (id: string, name: string) => void;
  onOpen: (id: string) => void;
}) {
  if (isEditing) {
    return (
      <ProjectForm
        initialName={project.name}
        initialDescription={project.description || ''}
        submitLabel="Save Changes"
        onSubmit={(name, desc) => onUpdate(project._id, name, desc)}
        onCancel={onCancelEdit}
      />
    );
  }

  const updatedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.name}</h3>
          {project.description && (
            <p className="text-gray-600 mb-2">{project.description}</p>
          )}
          <p className="text-sm text-gray-400">Updated {updatedDate}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onOpen(project._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit project"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(project._id, project.name)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete project"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROJECT DETAIL PAGE
// ============================================================================

function ProjectDetailPage({ 
  projectId, 
  onNavigateBack 
}: { 
  projectId: string;
  onNavigateBack: () => void;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'help' | 'export'>('cards');

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectRes, cardsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/cards?projectId=${projectId}`),
      ]);

      if (!projectRes.ok) {
        const data = await projectRes.json();
        throw new Error(data.error || 'Failed to load project');
      }
      if (!cardsRes.ok) {
        const data = await cardsRes.json();
        throw new Error(data.error || 'Failed to load cards');
      }

      const projectData = await projectRes.json();
      const cardsData = await cardsRes.json();

      setProject(projectData);
      setCards(cardsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async (cardData: Omit<Card, '_id' | 'projectId' | 'createdAt' | 'updatedAt' | '__v' | 'issueFlags'>) => {
    setError(null);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardData, projectId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create card');
      }
      await loadProjectData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      return false;
    }
  };

  const handleUpdateCard = async (cardId: string, updates: Partial<Card>) => {
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update card');
      }
      await loadProjectData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
      return false;
    }
  };

  const handleDeleteCard = async (cardId: string, className: string) => {
    if (!confirm(`Delete card "${className}"? This cannot be undone.`)) return;
    
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete card');
      }
      await loadProjectData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-gray-600">{project.description}</p>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'cards'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Cards ({cards.length})
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'help'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Help
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Export
          </button>
        </div>
      </div>

      {activeTab === 'cards' && (
        <CardsSection
          cards={cards}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {activeTab === 'help' && <HelpSection />}

      {activeTab === 'export' && <ExportSection />}
    </div>
  );
}

// ============================================================================
// CARDS SECTION
// ============================================================================

function CardsSection({
  cards,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
}: {
  cards: Card[];
  onCreateCard: (data: Omit<Card, '_id' | 'projectId' | 'createdAt' | 'updatedAt' | '__v' | 'issueFlags'>) => Promise<boolean>;
  onUpdateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  onDeleteCard: (id: string, className: string) => void;
}) {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <CardForm onSubmit={onCreateCard} />
      </div>

      {cards.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No cards yet</p>
          <p className="text-gray-400 text-sm mt-2">Create your first CRC card above</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardItem
              key={card._id}
              card={card}
              isEditing={editingCardId === card._id}
              onEdit={() => setEditingCardId(card._id)}
              onCancelEdit={() => setEditingCardId(null)}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CARD FORM COMPONENT
// ============================================================================

function CardForm({
  onSubmit,
  initialData,
  submitLabel = 'Add Card',
  onCancel,
}: {
  onSubmit: (data: Omit<Card, '_id' | 'projectId' | 'createdAt' | 'updatedAt' | '__v' | 'issueFlags'>) => Promise<boolean>;
  initialData?: Card;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const [className, setClassName] = useState(initialData?.className || '');
  const [responsibilities, setResponsibilities] = useState(
    initialData?.responsibilities.join(', ') || ''
  );
  const [collaborators, setCollaborators] = useState(
    initialData?.collaborators.join(', ') || ''
  );
  const [attributes, setAttributes] = useState(
    initialData?.attributes.join(', ') || ''
  );
  const [methods, setMethods] = useState(
    initialData?.methods.join(', ') || ''
  );
  const [submitting, setSubmitting] = useState(false);

  const parseArray = (str: string): string[] => {
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const responsibilitiesArray = parseArray(responsibilities);
    const collaboratorsArray = parseArray(collaborators);

    if (!className.trim() || responsibilitiesArray.length === 0 || collaboratorsArray.length === 0) {
      return;
    }

    setSubmitting(true);
    const success = await onSubmit({
      className: className.trim(),
      responsibilities: responsibilitiesArray,
      collaborators: collaboratorsArray,
      attributes: parseArray(attributes),
      methods: parseArray(methods),
    });
    setSubmitting(false);

    if (success && !onCancel) {
      setClassName('');
      setResponsibilities('');
      setCollaborators('');
      setAttributes('');
      setMethods('');
    }
  };

  const isValid = className.trim() && parseArray(responsibilities).length > 0 && parseArray(collaborators).length > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {initialData ? 'Edit Card' : 'New CRC Card'}
      </h3>
      <div className="grid gap-4">
        <div>
          <label htmlFor="card-className" className="block text-sm font-medium text-gray-700 mb-1">
            Class Name *
          </label>
          <input
            id="card-className"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Customer"
            disabled={submitting}
            required
          />
        </div>
        <div>
          <label htmlFor="card-responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
            Responsibilities * <span className="text-gray-500 text-xs">(comma-separated)</span>
          </label>
          <textarea
            id="card-responsibilities"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Knows name, Knows address, Knows phone number"
            rows={3}
            disabled={submitting}
            required
          />
        </div>
        <div>
          <label htmlFor="card-collaborators" className="block text-sm font-medium text-gray-700 mb-1">
            Collaborators * <span className="text-gray-500 text-xs">(comma-separated)</span>
          </label>
          <input
            id="card-collaborators"
            type="text"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Order, Invoice, PaymentProcessor"
            disabled={submitting}
            required
          />
        </div>
        <div>
          <label htmlFor="card-attributes" className="block text-sm font-medium text-gray-700 mb-1">
            Attributes <span className="text-gray-500 text-xs">(optional, comma-separated)</span>
          </label>
          <input
            id="card-attributes"
            type="text"
            value={attributes}
            onChange={(e) => setAttributes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="name, address, phoneNumber"
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="card-methods" className="block text-sm font-medium text-gray-700 mb-1">
            Methods <span className="text-gray-500 text-xs">(optional, comma-separated)</span>
          </label>
          <input
            id="card-methods"
            type="text"
            value={methods}
            onChange={(e) => setMethods(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="getName(), setAddress(), getPhoneNumber()"
            disabled={submitting}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

// ============================================================================
// CARD ITEM COMPONENT
// ============================================================================

function CardItem({
  card,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: {
  card: Card;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, updates: Partial<Card>) => Promise<boolean>;
  onDelete: (id: string, className: string) => void;
}) {
  if (isEditing) {
    return (
      <div className="md:col-span-2 lg:col-span-3">
        <CardForm
          initialData={card}
          submitLabel="Save Changes"
          onSubmit={(data) => onUpdate(card._id, data)}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{card.className}</h3>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            aria-label="Edit card"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(card._id, card.className)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            aria-label="Delete card"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Responsibilities
          </h4>
          <ul className="space-y-1">
            {card.responsibilities.map((resp, idx) => (
              <li key={idx} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0">
                {resp}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Collaborators
          </h4>
          <div className="flex flex-wrap gap-2">
            {card.collaborators.map((collab, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
              >
                {collab}
              </span>
            ))}
          </div>
        </div>

        {card.attributes.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Attributes
            </h4>
            <div className="flex flex-wrap gap-2">
              {card.attributes.map((attr, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}

        {card.methods.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              {card.methods.map((method, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-mono rounded"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

        {card.issueFlags.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <AlertCircle size={14} />
              Issues
            </h4>
            <div className="space-y-2">
              {card.issueFlags.map((issue, idx) => (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded ${
                    issue.severity === 'high'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : issue.severity === 'medium'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  <span className="font-semibold">{issue.category}:</span> {issue.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HELP SECTION
// ============================================================================

function HelpSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About CRC Cards</h2>
      
      <div className="prose max-w-none space-y-6 text-gray-700">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What are CRC Cards?</h3>
          <p>
            CRC (Class-Responsibility-Collaborator) cards are a brainstorming tool used in object-oriented design. 
            Each card represents a class in your system and captures three key aspects:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Class Name:</strong> The name of the class or component
            </li>
            <li>
              <strong>Responsibilities:</strong> What the class knows or does (its purpose and behavior)
            </li>
            <li>
              <strong>Collaborators:</strong> Other classes this class interacts with to fulfill its responsibilities
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Tool</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Create a new project from the Projects page to organize related CRC cards</li>
            <li>Add cards for each class in your system design</li>
            <li>Define clear, concise responsibilities for each class (what it knows or does)</li>
            <li>Identify collaborators (other classes it works with)</li>
            <li>Optionally add attributes and methods for more detailed documentation</li>
            <li>Review and refine your design by examining relationships between cards</li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Practices</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Keep responsibilities focused and specific to maintain single responsibility principle</li>
            <li>Limit the number of collaborators to reduce coupling between classes</li>
            <li>Use clear, descriptive names for classes and responsibilities</li>
            <li>Review cards as a team to identify design improvements</li>
            <li>Iterate on your design as you discover new requirements or issues</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Tips for Effective CRC Sessions</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Start with high-level classes and refine them over time</li>
            <li>Use role-playing to walk through scenarios and validate your design</li>
            <li>Look for classes with too many responsibilities as candidates for splitting</li>
            <li>Ensure collaborations are bidirectional when appropriate</li>
            <li>Don't worry about getting everything perfect initially—CRC cards are for exploration</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT SECTION
// ============================================================================

function ExportSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Export Project</h2>
      
      <div className="space-y-6">
        <p className="text-gray-700">
          Export your CRC cards in various formats for documentation, presentations, or further analysis.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">JSON Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export all cards as a JSON file for programmatic use or backup
            </p>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate a PDF document with all your CRC cards formatted for printing
            </p>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Markdown Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export as Markdown for easy integration with documentation systems
            </p>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Diagram Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate a visual diagram showing class relationships
            </p>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Export functionality is currently in development. 
            Your data is safely stored and you can continue working on your CRC cards.
          </p>
        </div>
      </div>
    </div>
  );
}