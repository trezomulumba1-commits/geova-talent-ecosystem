import React, { useState, useEffect } from 'react';
import { 
  AppMode, 
  EcosystemView, 
  PrepView, 
  UserRole,
  Student, 
  Project, 
  Company, 
  Opportunity, 
  CollabPost, 
  LibraryResource,
  ProjectSquad
} from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_PROJECTS, 
  INITIAL_COMPANIES, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_COLLABS, 
  INITIAL_PREP_SESSIONS, 
  INITIAL_LIBRARY_RESOURCES,
  INITIAL_PROJECT_SQUADS 
} from './data/mockData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

// Ecosystem screens
import { LandingView } from './components/ecosystem/LandingView';
import { HomeDashboardView } from './components/ecosystem/HomeDashboardView';
import { DiscoverView } from './components/ecosystem/DiscoverView';
import { ProjectDetailView } from './components/ecosystem/ProjectDetailView';
import { StudentProfileView } from './components/ecosystem/StudentProfileView';
import { CollabView } from './components/ecosystem/CollabView';
import { CompanyProfileView } from './components/ecosystem/CompanyProfileView';
import { OpportunityDetailView } from './components/ecosystem/OpportunityDetailView';
import { TeamSquadsProgressView } from './components/ecosystem/TeamSquadsProgressView';
import { TeacherCompanyPortalView } from './components/ecosystem/TeacherCompanyPortalView';
import { CommunityForumView } from './components/ecosystem/CommunityForumView';
import { GlobalAnalyticsView } from './components/ecosystem/GlobalAnalyticsView';

// Prep screens
import { PrepHubView } from './components/prep/PrepHubView';
import { PracticeArenaView } from './components/prep/PracticeArenaView';
import { PerformanceReviewView } from './components/prep/PerformanceReviewView';
import { ResourceLibraryView } from './components/prep/ResourceLibraryView';
import { SystemArchitectView } from './components/prep/SystemArchitectView';

// Modals
import { ApplyModal } from './components/modals/ApplyModal';
import { CreateCollabModal } from './components/modals/CreateCollabModal';
import { ConnectModal } from './components/modals/ConnectModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { PostOpportunityModal } from './components/modals/PostOpportunityModal';

import { LoadingScreen } from './components/common/LoadingScreen';
import { LoginPage } from './pages/LoginPage';
import { getCachedUser, logout as authLogout, PortalRole } from './services/authService';
import {
  fetchStudents,
  fetchCompanies,
  fetchOpportunities,
  fetchCollabs,
  createCollabPost,
  createOpportunity,
  toggleCollabInterest,
  sendConnectionRequest,
} from './services/apiService';

export function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getCachedUser());

  // Sync cached auth user into currentUser on first load with strict RBAC
  useEffect(() => {
    const authUser = getCachedUser();
    if (authUser && isAuthenticated) {
      const mappedRole: UserRole =
        authUser.role === 'employer' ? 'company' : authUser.role === 'provider' ? 'teacher' : 'student';
      setUserRole(mappedRole);
      localStorage.setItem('geova_user_role', mappedRole);

      setCurrentUser(prev => ({
        ...prev,
        id: authUser.id,
        name: authUser.name,
        role: authUser.role === 'employer' ? 'Recruiter' : authUser.role === 'provider' ? 'Faculty' : authUser.role === 'admin' ? 'Administrator' : 'Student',
        title: authUser.title || prev.title,
        avatar: authUser.avatar || prev.avatar,
        about: authUser.bio || prev.about,
      }));

      // Enforce portal isolation
      if (mappedRole === 'student') {
        setEcosystemView(prev => (prev === 'teacher-company-portal' || prev === 'global-analytics' ? 'home' : prev));
      } else {
        setEcosystemView(prev => (prev === 'home' || prev === 'squads-progress' || prev === 'student-profile' ? 'teacher-company-portal' : prev));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (appLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [appLoading]);

  // Current active mode: 'ecosystem' or 'prep'
  const [mode, setMode] = useState<AppMode>('ecosystem');

  // User role / Perspective (Student, Teacher/School, Company Sponsor)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('geova_user_role');
    if (saved === 'student' || saved === 'teacher' || saved === 'company') {
      return saved as UserRole;
    }
    return 'student';
  });

  // Sub-views
  const [ecosystemView, setEcosystemView] = useState<EcosystemView>('home'); // change default view to home instead of landing, or keep landing? Landing is fine but 'home' makes it feel like an app. Let's make it 'landing' but let users land elegantly. Actually 'home' is standard now. Let's keep 'home'.
  const [prepView, setPrepView] = useState<PrepView>('hub');

  // Active items selected
  const [selectedProjectId, setSelectedProjectId] = useState<string>('visionary-crm');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('alex-mwansa');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('nebula-ai');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('ml-intern-nebula');

  // Data state
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [collabs, setCollabs] = useState<CollabPost[]>(INITIAL_COLLABS);
  const [sessions, setSessions] = useState(INITIAL_PREP_SESSIONS);
  const [resources, setResources] = useState<LibraryResource[]>(INITIAL_LIBRARY_RESOURCES);
  const [squads, setSquads] = useState<ProjectSquad[]>(INITIAL_PROJECT_SQUADS);
  const [readinessScore, setReadinessScore] = useState<number>(78);

  // Fetch real database records from FastAPI / SQLite on initial mount
  useEffect(() => {
    let active = true;
    async function loadLiveData() {
      try {
        const [loadedStudents, loadedCompanies, loadedOpps, loadedCollabs] = await Promise.all([
          fetchStudents().catch(() => []),
          fetchCompanies().catch(() => []),
          fetchOpportunities().catch(() => []),
          fetchCollabs().catch(() => []),
        ]);

        if (active) {
          if (loadedStudents.length > 0) {
            setStudents(loadedStudents);
            const allProjects: Project[] = [];
            loadedStudents.forEach(st => {
              if (st.projects && st.projects.length > 0) {
                st.projects.forEach(p => {
                  allProjects.push({
                    id: p.id,
                    title: p.title,
                    tagline: p.description,
                    category: (p.type === 'Mobile UI' ? 'Mobile' : 'Web') as any,
                    status: 'Validated',
                    image: p.image,
                    creator: { name: st.name, role: st.role, avatar: st.avatar },
                    tags: st.skills || ['Full-Stack'],
                    problem: p.description,
                    solution: p.description,
                    keyFeatures: ['Live Data Architecture', 'Production Ready', 'Verified Capability'],
                    contribution: 'Architecture & Full-Stack Implementation',
                    technologies: st.skills || ['React', 'TypeScript', 'Node.js'],
                    gallery: [p.image],
                  });
                });
              }
            });
            if (allProjects.length > 0) {
              setProjects(allProjects);
            }
          }
          if (loadedCompanies.length > 0) setCompanies(loadedCompanies);
          if (loadedOpps.length > 0) setOpportunities(loadedOpps);
          if (loadedCollabs.length > 0) setCollabs(loadedCollabs);
        }
      } catch (err) {
        console.error('Failed to load live database records:', err);
      }
    }
    loadLiveData();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdateTaskStatus = (squadId: string, taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    setSquads(prev =>
      prev.map(s => {
        if (s.id === squadId) {
          const updatedTasks = s.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
          const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
          const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);
          return { ...s, tasks: updatedTasks, progressPercentage };
        }
        return s;
      })
    );
  };

  const handleAddTaskToSquad = (squadId: string, task: any) => {
    setSquads(prev =>
      prev.map(s => {
        if (s.id === squadId) {
          const updatedTasks = [...s.tasks, task];
          const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
          const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);
          return { ...s, tasks: updatedTasks, progressPercentage };
        }
        return s;
      })
    );
  };

  // Review Feedback Data
  const [lastFeedback, setLastFeedback] = useState<any>(null);

  // Modal states
  const [applyOpp, setApplyOpp] = useState<Opportunity | null>(null);
  const [createCollabOpen, setCreateCollabOpen] = useState(false);
  const [connectData, setConnectData] = useState<{ id?: string; name: string; role?: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [postOppOpen, setPostOppOpen] = useState(false);

  // Authenticated dynamic user profile state
  const [currentUser, setCurrentUser] = useState<Student>(() => {
    const saved = localStorage.getItem('geova_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user profile:', e);
      }
    }
    return INITIAL_STUDENTS[0];
  });

  const handleSaveUserProfile = (updatedProfile: Student, newRole: UserRole) => {
    setCurrentUser(updatedProfile);
    setUserRole(newRole);
    localStorage.setItem('geova_user_profile', JSON.stringify(updatedProfile));
    setStudents(prev => {
      const exists = prev.some(s => s.id === updatedProfile.id);
      if (exists) {
        return prev.map(s => s.id === updatedProfile.id ? updatedProfile : s);
      }
      return [updatedProfile, ...prev];
    });
  };

  const handleLogout = () => {
    authLogout();
    setIsAuthenticated(false);
    setSettingsOpen(false);
  };

  // Handlers for Ecosystem navigation
  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setEcosystemView('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setEcosystemView('student-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setEcosystemView('company-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOpportunity = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setEcosystemView('opportunity-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCollabInterest = async (collabId: string) => {
    setCollabs(prev =>
      prev.map(c => {
        if (c.id === collabId) {
          const newInterested = !c.userInterested;
          return {
            ...c,
            userInterested: newInterested,
            interestedCount: (c.interestedCount || 0) + (newInterested ? 1 : -1)
          };
        }
        return c;
      })
    );

    try {
      await toggleCollabInterest(collabId);
    } catch (err) {
      console.warn('Could not record collab interest in DB:', err);
    }
  };

  const handleToggleResourceComplete = (resourceId: string) => {
    setResources(prev =>
      prev.map(r => {
        if (r.id === resourceId) {
          const newCompleted = !r.completed;
          // Dynamically adjust readiness score
          setReadinessScore(score => Math.min(100, Math.max(50, score + (newCompleted ? 3 : -3))));
          return { ...r, completed: newCompleted };
        }
        return r;
      })
    );
  };

  const handleFinishArenaSession = (feedback: any) => {
    setLastFeedback(feedback);
    setReadinessScore(prev => Math.min(95, prev + 7));
    setPrepView('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCollab = async (postData: { title: string; phase: string; description: string; tags: string[] }) => {
    try {
      const created = await createCollabPost(postData);
      setCollabs(prev => [created, ...prev]);
    } catch (err) {
      console.warn('Backend creation failed, creating local fallback:', err);
      const newPost: CollabPost = {
        id: `collab-${Date.now()}`,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        phase: postData.phase,
        title: postData.title,
        description: postData.description,
        tags: postData.tags,
        interestedCount: 1,
        userInterested: true
      };
      setCollabs(prev => [newPost, ...prev]);
    } finally {
      setCreateCollabOpen(false);
    }
  };

  const handleCreateOpportunity = async (data: {
    title: string;
    type: string;
    location: string;
    stipend: string;
    tags: string[];
    overview: string;
  }) => {
    const opp = await createOpportunity({
      companyId: companies[0]?.id || 'nebula-ai',
      companyName: companies[0]?.name || currentUser.name || 'Enterprise Partner',
      companyLogo: companies[0]?.logo || currentUser.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      title: data.title,
      type: data.type,
      location: data.location,
      duration: '3-6 Months',
      stipend: data.stipend,
      tags: data.tags,
      overview: data.overview,
    });
    setOpportunities(prev => [opp, ...prev]);
  };

  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setProjects(INITIAL_PROJECTS);
    setCompanies(INITIAL_COMPANIES);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setCollabs(INITIAL_COLLABS);
    setResources(INITIAL_LIBRARY_RESOURCES);
    setReadinessScore(78);
  };

  // Find active items
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const activeCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
  const activeOpportunity = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  // Auth-gate: show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onAuthSuccess={(role: PortalRole, userName: string) => {
          const roleMap: Record<PortalRole, UserRole> = { student: 'student', employer: 'company', provider: 'teacher', admin: 'student' };
          setUserRole(roleMap[role]);
          localStorage.setItem('geova_user_role', roleMap[role]);
          if (role === 'employer' || role === 'provider') {
            setEcosystemView('teacher-company-portal');
          } else {
            setEcosystemView('home');
          }
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#09090b] text-[#0b1c30] dark:text-[#f4f4f5] flex flex-col selection:bg-[#3525cd] selection:text-white transition-colors duration-200">
      <LoadingScreen onComplete={() => setAppLoading(false)} duration={2200} />

      {/* Universal Responsive Header */}
      <Header
        mode={mode}
        onSelectMode={m => {
          setMode(m);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ecosystemView={ecosystemView}
        onSelectEcosystemView={v => {
          setMode('ecosystem');
          setEcosystemView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        prepView={prepView}
        onSelectPrepView={v => {
          setMode('prep');
          setPrepView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenEditProfile={() => setUserProfileModalOpen(true)}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full animate-in fade-in duration-200 pb-24 md:pb-0">
        {mode === 'ecosystem' ? (
          <>
            {ecosystemView === 'landing' && (
              <LandingView
                onNavigate={view => {
                  setEcosystemView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenProject={handleOpenProject}
              />
            )}

            {ecosystemView === 'home' && (
              <HomeDashboardView
                currentUser={currentUser}
                projects={projects}
                collabs={collabs}
                students={students}
                companies={companies}
                opportunities={opportunities}
                readinessScore={readinessScore}
                onNavigate={view => {
                  if (view === ('hub' as any)) {
                    setMode('prep');
                    setPrepView('hub');
                  } else if (view === ('arena' as any)) {
                    setMode('prep');
                    setPrepView('arena');
                  } else if (view === ('library' as any)) {
                    setMode('prep');
                    setPrepView('library');
                  } else {
                    setEcosystemView(view);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenProject={handleOpenProject}
                onOpenStudent={handleOpenStudent}
                onOpenCompany={handleOpenCompany}
                onOpenOpportunity={handleOpenOpportunity}
                onConnectStudent={s => setConnectData({ id: s.id, name: s.name, role: s.role })}
                onToggleCollabInterest={handleToggleCollabInterest}
                onStartArena={() => {
                  setMode('prep');
                  setPrepView('arena');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {ecosystemView.startsWith('discover') && (
              <DiscoverView
                initialTab={
                  ecosystemView === 'discover-talent'
                    ? 'students'
                    : ecosystemView === 'discover-companies'
                    ? 'companies'
                    : ecosystemView === 'discover-opportunities'
                    ? 'opportunities'
                    : 'projects'
                }
                students={students}
                projects={projects}
                companies={companies}
                opportunities={opportunities}
                onOpenStudent={handleOpenStudent}
                onOpenProject={handleOpenProject}
                onOpenCompany={handleOpenCompany}
                onOpenOpportunity={handleOpenOpportunity}
                onConnectStudent={s => setConnectData({ id: s.id, name: s.name, role: s.role })}
              />
            )}

            {ecosystemView === 'project-detail' && (
              <ProjectDetailView
                project={activeProject}
                onBack={() => setEcosystemView('discover-projects')}
                onOpenCreator={name => {
                  const s = students.find(st => st.name.toLowerCase().includes(name.toLowerCase()));
                  if (s) handleOpenStudent(s.id);
                }}
                onConnectCreator={name => setConnectData({ name, role: 'Project Creator' })}
              />
            )}

            {ecosystemView === 'student-profile' && (
              <StudentProfileView
                student={activeStudent}
                projects={projects}
                onOpenProject={handleOpenProject}
                onConnectStudent={s => setConnectData({ id: s.id, name: s.name, role: s.role })}
                onNavigate={view => setEcosystemView(view)}
              />
            )}

            {ecosystemView === 'collab' && (
              <CollabView
                collabs={collabs}
                currentUser={currentUser}
                onToggleInterest={handleToggleCollabInterest}
                onOpenCreateCollab={() => setCreateCollabOpen(true)}
                onConnectAuthor={author => setConnectData({ name: author, role: 'Collab Initiator' })}
              />
            )}

            {ecosystemView === 'company-profile' && (
              <CompanyProfileView
                company={activeCompany}
                opportunities={opportunities}
                projects={projects}
                onBack={() => setEcosystemView('discover-companies')}
                onOpenOpportunity={handleOpenOpportunity}
                onOpenProject={handleOpenProject}
              />
            )}

            {ecosystemView === 'opportunity-detail' && (
              <OpportunityDetailView
                opportunity={activeOpportunity}
                onBack={() => setEcosystemView('discover-opportunities')}
                onApply={opp => setApplyOpp(opp)}
                onOpenCompany={handleOpenCompany}
                onConnectManager={name => setConnectData({ name, role: 'Hiring Manager' })}
              />
            )}

            {ecosystemView === 'squads-progress' && (
              <TeamSquadsProgressView
                squads={squads}
                currentUser={currentUser}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onAddProjectSquad={squad => setSquads(prev => [squad, ...prev])}
                onAddTask={handleAddTaskToSquad}
              />
            )}

            {ecosystemView === 'teacher-company-portal' && (
              <TeacherCompanyPortalView
                companies={companies}
                opportunities={opportunities}
                students={students}
                onOpenOpportunity={handleOpenOpportunity}
                onOpenStudent={handleOpenStudent}
                forcedRole={userRole === 'student' ? undefined : (userRole as 'teacher' | 'company')}
                onOpenPostModal={() => setPostOppOpen(true)}
              />
            )}

            {ecosystemView === 'community-forum' && (
              <CommunityForumView
                currentUser={currentUser}
              />
            )}

            {ecosystemView === 'global-analytics' && (
              <GlobalAnalyticsView
                currentUser={currentUser}
              />
            )}
          </>
        ) : (
          <>
            {prepView === 'hub' && (
              <PrepHubView
                currentUser={currentUser}
                sessions={sessions}
                readinessScore={readinessScore}
                onNavigatePrep={v => {
                  setPrepView(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartArena={() => {
                  setPrepView('arena');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {prepView === 'arena' && (
              <PracticeArenaView
                currentUser={currentUser}
                onFinishSession={handleFinishArenaSession}
                onBackToHub={() => setPrepView('hub')}
              />
            )}

            {prepView === 'review' && (
              <PerformanceReviewView
                currentUser={currentUser}
                feedbackData={lastFeedback}
                onRetake={() => {
                  setPrepView('arena');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigatePrep={v => {
                  setPrepView(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {prepView === 'library' && (
              <ResourceLibraryView
                currentUser={currentUser}
                resources={resources}
                onToggleResourceComplete={handleToggleResourceComplete}
                onNavigatePrep={v => {
                  setPrepView(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {prepView === 'system-architect' && (
              <SystemArchitectView />
            )}
          </>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        mode={mode}
        ecosystemView={ecosystemView}
        onSelectEcosystemView={v => {
          setMode('ecosystem');
          setEcosystemView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        prepView={prepView}
        onSelectPrepView={v => {
          setMode('prep');
          setPrepView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Active Interactive Modals */}
      {applyOpp && (
        <ApplyModal
          opportunity={applyOpp}
          currentUser={currentUser}
          onClose={() => setApplyOpp(null)}
          onSubmit={_data => {
            setApplyOpp(null);
          }}
        />
      )}

      {createCollabOpen && (
        <CreateCollabModal
          currentUser={currentUser}
          onClose={() => setCreateCollabOpen(false)}
          onSubmit={handleAddCollab}
        />
      )}

      {connectData && (
        <ConnectModal
          recipientName={connectData.name}
          recipientRole={connectData.role}
          onClose={() => setConnectData(null)}
          onSend={async msg => {
            if ((connectData as any).id) {
              try {
                await sendConnectionRequest((connectData as any).id, msg);
              } catch (e) {
                console.warn('Could not record connection in DB:', e);
              }
            }
            setConnectData(null);
          }}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onResetData={handleResetData}
          onLogout={handleLogout}
        />
      )}

      {userProfileModalOpen && (
        <UserProfileModal
          currentUser={currentUser}
          userRole={userRole}
          onSaveProfile={handleSaveUserProfile}
          onClose={() => setUserProfileModalOpen(false)}
        />
      )}

      {postOppOpen && (
        <PostOpportunityModal
          companyName={companies[0]?.name || currentUser.name}
          companyLogo={companies[0]?.logo || currentUser.avatar}
          onClose={() => setPostOppOpen(false)}
          onSubmit={handleCreateOpportunity}
        />
      )}
    </div>
  );
}

export default App;
