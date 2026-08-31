import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteProfile, Project, Certificate, ContactMessage, ToolItem, SkillGroup } from '../types';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROJECTS, 
  INITIAL_CERTIFICATES, 
  INITIAL_TOOLS, 
  INITIAL_SKILL_GROUPS 
} from '../data/initialData';
import { 
  fetchFullSiteData, 
  saveFullSiteData, 
  fetchProfilePhotoUrl,
  fetchContactMessages,
  deleteContactMessageFromDb,
  markContactMessageReadInDb,
  clearContactMessagesInDb
} from '../lib/supabase';

interface PortfolioContextType {
  profile: SiteProfile;
  projects: Project[];
  certificates: Certificate[];
  messages: ContactMessage[];
  tools: ToolItem[];
  skillGroups: SkillGroup[];
  publishedProjects: Project[];
  isAdminAuthenticated: boolean;
  lockoutRemainingSeconds: number;
  refreshProfilePhoto: () => Promise<void>;
  updateProfile: (updated: Partial<SiteProfile>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (orderedProjects: Project[]) => void;
  addCertificate: (cert: Omit<Certificate, 'id' | 'createdAt'>) => Certificate;
  updateCertificate: (id: string, updated: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => ContactMessage;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  clearMessages: () => void;
  addTool: (tool: Omit<ToolItem, 'id'>) => ToolItem;
  updateTool: (id: string, updated: Partial<ToolItem>) => void;
  deleteTool: (id: string) => void;
  reorderTools: (orderedTools: ToolItem[]) => void;
  addSkillGroup: (group: Omit<SkillGroup, 'id'>) => SkillGroup;
  updateSkillGroup: (id: string, updated: Partial<SkillGroup>) => void;
  deleteSkillGroup: (id: string) => void;
  addSkillItem: (groupId: string, item: string) => void;
  removeSkillItem: (groupId: string, itemIndex: number) => void;
  changeAdminPasscode: (currentPasscode: string, newPasscode: string) => { success: boolean; message: string };
  loginAdmin: (passcode: string) => { success: boolean; message: string; locked?: boolean };
  logoutAdmin: () => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (jsonString: string) => { success: boolean; message: string };
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'ar_portfolio_profile_v2',
  PROJECTS: 'ar_portfolio_projects_v2',
  CERTIFICATES: 'ar_portfolio_certificates_v2',
  MESSAGES: 'ar_portfolio_messages_v2',
  TOOLS: 'ar_portfolio_tools_v2',
  SKILL_GROUPS: 'ar_portfolio_skill_groups_v2',
  ADMIN_AUTH: 'ar_portfolio_admin_auth_v2',
  FAILED_ATTEMPTS: 'ar_portfolio_failed_attempts_v2',
  LOCKOUT_UNTIL: 'ar_portfolio_lockout_until_v2',
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Profile from LocalStorage
  const [profile, setProfile] = useState<SiteProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? { ...INITIAL_PROFILE, ...JSON.parse(saved) } : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Initialize Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Initialize Certificates
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  });

  // Initialize Messages Inbox
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initialize Tools List
  const [tools, setTools] = useState<ToolItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOOLS);
      return saved ? JSON.parse(saved) : INITIAL_TOOLS;
    } catch {
      return INITIAL_TOOLS;
    }
  });

  // Initialize Skill Groups
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILL_GROUPS);
      return saved ? JSON.parse(saved) : INITIAL_SKILL_GROUPS;
    } catch {
      return INITIAL_SKILL_GROUPS;
    }
  });

  // Admin Auth State (session/local)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Lockout countdown state
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Check Lockout on Mount / Interval
  useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL) || '0', 10);
        const now = Date.now();
        if (lockoutUntil > now) {
          setLockoutRemainingSeconds(Math.ceil((lockoutUntil - now) / 1000));
        } else {
          setLockoutRemainingSeconds(0);
        }
      } catch {
        setLockoutRemainingSeconds(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Cloud Synchronization (Loads latest data from Supabase for all visitors worldwide)
  const isInitialMount = React.useRef(true);

  const refreshProfilePhoto = async () => {
    try {
      const remote = await fetchFullSiteData();
      if (remote) {
        if (remote.profile) {
          setProfile((prev) => ({ ...prev, ...remote.profile }));
        }
        if (remote.projects && Array.isArray(remote.projects) && remote.projects.length > 0) {
          setProjects(remote.projects);
        }
        if (remote.tools && Array.isArray(remote.tools) && remote.tools.length > 0) {
          setTools(remote.tools);
        }
        if (remote.skillGroups && Array.isArray(remote.skillGroups) && remote.skillGroups.length > 0) {
          setSkillGroups(remote.skillGroups);
        }
        if (remote.certificates && Array.isArray(remote.certificates) && remote.certificates.length > 0) {
          setCertificates(remote.certificates);
        }
      }
    } catch (err) {
      console.warn('Could not sync full site data from Supabase:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadFromCloud = async () => {
      try {
        const remote = await fetchFullSiteData();
        if (!isMounted || !remote) {
          isInitialMount.current = false;
          return;
        }
        if (remote.profile) {
          setProfile((prev) => ({ ...prev, ...remote.profile }));
        }
        if (remote.projects && Array.isArray(remote.projects) && remote.projects.length > 0) {
          setProjects(remote.projects);
        }
        if (remote.tools && Array.isArray(remote.tools) && remote.tools.length > 0) {
          setTools(remote.tools);
        }
        if (remote.skillGroups && Array.isArray(remote.skillGroups) && remote.skillGroups.length > 0) {
          setSkillGroups(remote.skillGroups);
        }
        if (remote.certificates && Array.isArray(remote.certificates) && remote.certificates.length > 0) {
          setCertificates(remote.certificates);
        }

        // Fetch cloud contact messages
        const cloudMessages = await fetchContactMessages();
        if (cloudMessages && Array.isArray(cloudMessages) && cloudMessages.length > 0) {
          setMessages(cloudMessages);
        }
      } catch (e) {
        console.warn('Initial cloud sync error:', e);
      } finally {
        setTimeout(() => {
          if (isMounted) isInitialMount.current = false;
        }, 600);
      }
    };

    loadFromCloud();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-sync all admin changes to Supabase cloud
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    const timer = setTimeout(() => {
      saveFullSiteData({
        profile,
        projects,
        tools,
        skillGroups,
        certificates,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [profile, projects, tools, skillGroups, certificates]);

  // Sync to LocalStorage (continuous safety backup)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
    } catch (e) {
      console.error('Failed to save certificates', e);
    }
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
    } catch (e) {
      console.error('Failed to save tools', e);
    }
  }, [tools]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(skillGroups));
    } catch (e) {
      console.error('Failed to save skill groups', e);
    }
  }, [skillGroups]);

  // Derived published projects (sorted by order)
  const publishedProjects = projects
    .filter((p) => p.isPublished)
    .sort((a, b) => a.order - b.order);

  // Profile Update (Synchronous LocalStorage write)
  const updateProfile = (updated: Partial<SiteProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Projects CRUD (Synchronous LocalStorage write)
  const addProject = (data: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...data,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      order: data.order ?? projects.length + 1,
    };
    setProjects((prev) => {
      const next = [...prev, newProject];
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return newProject;
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const reorderProjects = (orderedProjects: Project[]) => {
    const updated = orderedProjects.map((p, index) => ({
      ...p,
      order: index + 1,
    }));
    setProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    } catch (e) {}
  };

  // Certificates CRUD (Synchronous LocalStorage write)
  const addCertificate = (data: Omit<Certificate, 'id' | 'createdAt'>) => {
    const newCert: Certificate = {
      ...data,
      id: 'cert-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCertificates((prev) => {
      const next = [newCert, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return newCert;
  };

  const updateCertificate = (id: string, updated: Partial<Certificate>) => {
    setCertificates((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Messages CRUD
  const addMessage = (data: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...data,
      id: 'msg-' + Date.now(),
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      read: false,
    };
    setMessages((prev) => {
      const next = [newMsg, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return newMsg;
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => {
      const next = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    deleteContactMessageFromDb(id).catch((e) => console.warn('Supabase delete message err:', e));
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, read: true } : m));
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    markContactMessageReadInDb(id).catch((e) => console.warn('Supabase mark read err:', e));
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    clearContactMessagesInDb().catch((e) => console.warn('Supabase clear messages err:', e));
  };

  // Tools CRUD
  const addTool = (data: Omit<ToolItem, 'id'>) => {
    const newTool: ToolItem = {
      ...data,
      id: 'tool-' + Date.now(),
      order: tools.length + 1,
    };
    setTools((prev) => {
      const next = [...prev, newTool];
      try {
        localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return newTool;
  };

  const updateTool = (id: string, updated: Partial<ToolItem>) => {
    setTools((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      try {
        localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteTool = (id: string) => {
    setTools((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const reorderTools = (orderedTools: ToolItem[]) => {
    const updated = orderedTools.map((t, index) => ({
      ...t,
      order: index + 1,
    }));
    setTools(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated));
    } catch (e) {}
  };

  // Skill Groups CRUD
  const addSkillGroup = (data: Omit<SkillGroup, 'id'>) => {
    const newGroup: SkillGroup = {
      ...data,
      id: 'group-' + Date.now(),
      order: skillGroups.length + 1,
    };
    setSkillGroups((prev) => {
      const next = [...prev, newGroup];
      try {
        localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return newGroup;
  };

  const updateSkillGroup = (id: string, updated: Partial<SkillGroup>) => {
    setSkillGroups((prev) => {
      const next = prev.map((g) => (g.id === id ? { ...g, ...updated } : g));
      try {
        localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteSkillGroup = (id: string) => {
    setSkillGroups((prev) => {
      const next = prev.filter((g) => g.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const addSkillItem = (groupId: string, item: string) => {
    if (!item.trim()) return;
    setSkillGroups((prev) => {
      const next = prev.map((g) =>
        g.id === groupId && !g.items.includes(item.trim())
          ? { ...g, items: [...g.items, item.trim()] }
          : g
      );
      try {
        localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const removeSkillItem = (groupId: string, itemIndex: number) => {
    setSkillGroups((prev) => {
      const next = prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((_, idx) => idx !== itemIndex) }
          : g
      );
      try {
        localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Security: Change Passcode
  const changeAdminPasscode = (currentPasscode: string, newPasscode: string) => {
    if (currentPasscode.trim() !== profile.adminPasscode.trim()) {
      return { success: false, message: 'Current passcode is incorrect.' };
    }
    if (!newPasscode.trim() || newPasscode.trim().length < 6) {
      return { success: false, message: 'New passcode must be at least 6 characters.' };
    }
    updateProfile({ adminPasscode: newPasscode.trim() });
    return { success: true, message: 'Passcode changed successfully. Keep it safe!' };
  };

  // Security: Login with Rate Limiting & Lockout
  const loginAdmin = (passcode: string) => {
    const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL) || '0', 10);
    const now = Date.now();

    if (lockoutUntil > now) {
      const remaining = Math.ceil((lockoutUntil - now) / 1000);
      return {
        success: false,
        locked: true,
        message: `Too many failed attempts. Dashboard locked for ${remaining} seconds.`,
      };
    }

    if (passcode.trim() === profile.adminPasscode.trim()) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
      return { success: true, message: 'Authentication successful.' };
    } else {
      const attempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, String(attempts));

      if (attempts >= 5) {
        // Lock for 3 minutes (180 seconds)
        const lockTime = Date.now() + 180 * 1000;
        localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, String(lockTime));
        setLockoutRemainingSeconds(180);
        return {
          success: false,
          locked: true,
          message: 'Security Alert: 5 failed attempts. Access locked for 3 minutes.',
        };
      }

      return {
        success: false,
        message: `Incorrect passcode (${5 - attempts} attempts remaining before lockout).`,
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const resetToDefaults = () => {
    setProfile(INITIAL_PROFILE);
    setProjects(INITIAL_PROJECTS);
    setCertificates(INITIAL_CERTIFICATES);
    setTools(INITIAL_TOOLS);
    setSkillGroups(INITIAL_SKILL_GROUPS);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.TOOLS);
    localStorage.removeItem(STORAGE_KEYS.SKILL_GROUPS);
  };

  const exportData = () => {
    const exportObject = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile,
      projects,
      certificates,
      messages,
      tools,
      skillGroups,
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) {
        setProfile(data.profile);
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      }
      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      }
      if (Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
        localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(data.certificates));
      }
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(data.messages));
      }
      if (Array.isArray(data.tools)) {
        setTools(data.tools);
        localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(data.tools));
      }
      if (Array.isArray(data.skillGroups)) {
        setSkillGroups(data.skillGroups);
        localStorage.setItem(STORAGE_KEYS.SKILL_GROUPS, JSON.stringify(data.skillGroups));
      }
      return { success: true, message: 'Portfolio data successfully imported!' };
    } catch (err) {
      return { success: false, message: 'Invalid JSON format. Please check your backup file.' };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        certificates,
        messages,
        tools,
        skillGroups,
        publishedProjects,
        isAdminAuthenticated,
        lockoutRemainingSeconds,
        refreshProfilePhoto,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        addMessage,
        deleteMessage,
        markMessageRead,
        clearMessages,
        addTool,
        updateTool,
        deleteTool,
        reorderTools,
        addSkillGroup,
        updateSkillGroup,
        deleteSkillGroup,
        addSkillItem,
        removeSkillItem,
        changeAdminPasscode,
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
        exportData,
        importData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
