import { User, Form, Submission, Plan, ApiResponse } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: 'user-1',
    firstName: 'Anna',
    lastName: 'Martin',
    email: 'anna@example.com',
    role: 'USER',
    isEmailVerified: true,
    subscription: {
      plan: 'premium',
      maxForms: 20,
      maxSubmissionsPerMonth: 10000,
      currentForms: 8,
      currentSubmissions: 2340
    },
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@formbuilder.com',
    role: 'ADMIN',
    isEmailVerified: true,
    subscription: {
      plan: 'pro',
      maxForms: -1,
      maxSubmissionsPerMonth: -1,
      currentForms: 0,
      currentSubmissions: 0
    },
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockForms: Form[] = [
  {
    id: 'form-1',
    title: 'Contact Lead Generation',
    description: 'Formulaire de contact pour prospects',
    status: 'published',
    submissionCount: 245,
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-07-10T15:30:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-1',
        type: 'text',
        label: 'Nom complet',
        placeholder: 'Votre nom',
        required: true,
        order: 1
      },
      {
        id: 'field-2',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true,
        order: 2
      },
      {
        id: 'field-3',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Votre message',
        required: false,
        order: 3
      }
    ],
    settings: {
      theme: {
        primaryColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      },
      successMessage: 'Merci pour votre message !',
      notifications: {
        email: true
      }
    }
  },
  {
    id: 'form-3',
    title: 'Enquête de satisfaction',
    description: 'Collecte des avis clients après achat',
    status: 'published',
    submissionCount: 89,
    createdAt: '2024-07-01T08:00:00Z',
    updatedAt: '2024-07-14T11:20:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-6',
        type: 'text',
        label: 'Nom',
        placeholder: 'Votre nom',
        required: true,
        order: 1
      },
      {
        id: 'field-7',
        type: 'select',
        label: 'Note globale',
        required: true,
        options: ['1 - Très insatisfait', '2 - Insatisfait', '3 - Neutre', '4 - Satisfait', '5 - Très satisfait'],
        order: 2
      },
      {
        id: 'field-8',
        type: 'textarea',
        label: 'Commentaires',
        placeholder: 'Vos commentaires...',
        required: false,
        order: 3
      }
    ],
    settings: {
      theme: {
        primaryColor: '#F59E0B',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      },
      successMessage: 'Merci pour votre avis !',
      notifications: {
        email: true
      }
    }
  },
  {
    id: 'form-4',
    title: 'Inscription Événement',
    description: 'Formulaire d\'inscription pour notre prochain webinaire',
    status: 'draft',
    submissionCount: 0,
    createdAt: '2024-07-13T16:30:00Z',
    updatedAt: '2024-07-13T16:30:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-9',
        type: 'text',
        label: 'Prénom',
        placeholder: 'Votre prénom',
        required: true,
        order: 1
      },
      {
        id: 'field-10',
        type: 'text',
        label: 'Nom',
        placeholder: 'Votre nom',
        required: true,
        order: 2
      },
      {
        id: 'field-11',
        type: 'email',
        label: 'Email professionnel',
        placeholder: 'votre@entreprise.com',
        required: true,
        order: 3
      },
      {
        id: 'field-12',
        type: 'text',
        label: 'Entreprise',
        placeholder: 'Nom de votre entreprise',
        required: false,
        order: 4
      }
    ],
    settings: {
      theme: {
        primaryColor: '#8B5CF6',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      },
      successMessage: 'Inscription confirmée !',
      notifications: {
        email: true
      }
    }
  },
  {
    id: 'form-5',
    title: 'Demande de Devis',
    description: 'Formulaire pour demander un devis personnalisé',
    status: 'published',
    submissionCount: 156,
    createdAt: '2024-06-28T10:15:00Z',
    updatedAt: '2024-07-11T14:45:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-13',
        type: 'text',
        label: 'Nom complet',
        placeholder: 'Votre nom complet',
        required: true,
        order: 1
      },
      {
        id: 'field-14',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true,
        order: 2
      },
      {
        id: 'field-15',
        type: 'select',
        label: 'Type de projet',
        required: true,
        options: ['Site vitrine', 'E-commerce', 'Application web', 'Application mobile', 'Autre'],
        order: 3
      },
      {
        id: 'field-16',
        type: 'textarea',
        label: 'Description du projet',
        placeholder: 'Décrivez votre projet en détail...',
        required: true,
        order: 4
      },
      {
        id: 'field-17',
        type: 'select',
        label: 'Budget approximatif',
        required: false,
        options: ['< 5 000€', '5 000€ - 15 000€', '15 000€ - 50 000€', '> 50 000€'],
        order: 5
      }
    ],
    settings: {
      theme: {
        primaryColor: '#EF4444',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      },
      successMessage: 'Votre demande a été envoyée !',
      notifications: {
        email: true
      }
    }
  },
  {
    id: 'form-6',
    title: 'Candidature Emploi',
    description: 'Formulaire de candidature pour nos offres d\'emploi',
    status: 'published',
    submissionCount: 67,
    createdAt: '2024-07-05T09:00:00Z',
    updatedAt: '2024-07-12T16:30:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-18',
        type: 'text',
        label: 'Prénom',
        placeholder: 'Votre prénom',
        required: true,
        order: 1
      },
      {
        id: 'field-19',
        type: 'text',
        label: 'Nom',
        placeholder: 'Votre nom',
        required: true,
        order: 2
      },
      {
        id: 'field-20',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true,
        order: 3
      },
      {
        id: 'field-21',
        type: 'select',
        label: 'Poste souhaité',
        required: true,
        options: ['Développeur Frontend', 'Développeur Backend', 'Designer UI/UX', 'Chef de projet', 'Marketing'],
        order: 4
      },
      {
        id: 'field-22',
        type: 'textarea',
        label: 'Lettre de motivation',
        placeholder: 'Expliquez pourquoi vous souhaitez rejoindre notre équipe...',
        required: true,
        order: 5
      }
    ],
    settings: {
      theme: {
        primaryColor: '#06B6D4',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      },
      successMessage: 'Candidature reçue !',
      notifications: {
        email: true
      }
    }
  },
  {
    id: 'form-7',
    title: 'Support Technique',
    description: 'Formulaire de demande d\'assistance technique',
    status: 'disabled',
    submissionCount: 234,
    createdAt: '2024-05-15T11:30:00Z',
    updatedAt: '2024-07-08T13:15:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-23',
        type: 'text',
        label: 'Nom',
        placeholder: 'Votre nom',
        required: true,
        order: 1
      },
      {
        id: 'field-24',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true,
        order: 2
      },
      {
        id: 'field-25',
        type: 'select',
        label: 'Priorité',
        required: true,
        options: ['Faible', 'Normale', 'Élevée', 'Critique'],
        order: 3
      },
      {
        id: 'field-26',
        type: 'textarea',
        label: 'Description du problème',
        placeholder: 'Décrivez le problème rencontré...',
        required: true,
        order: 4
      }
    ],
    settings: {
      theme: {
        primaryColor: '#DC2626',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      },
      successMessage: 'Ticket créé !',
      notifications: {
        email: true
      }
    }
  },
  {
    id: 'form-2',
    title: 'Inscription Newsletter',
    description: 'Collecte d\'emails pour la newsletter',
    status: 'published',
    submissionCount: 1523,
    createdAt: '2024-05-20T14:00:00Z',
    updatedAt: '2024-07-12T09:15:00Z',
    userId: 'user-1',
    fields: [
      {
        id: 'field-4',
        type: 'email',
        label: 'Adresse email',
        placeholder: 'votre@email.com',
        required: true,
        order: 1
      },
      {
        id: 'field-5',
        type: 'checkbox',
        label: 'J\'accepte de recevoir les communications',
        required: true,
        order: 2
      }
    ],
    settings: {
      theme: {
        primaryColor: '#10B981',
        backgroundColor: '#F9FAFB',
        textColor: '#374151'
      },
      successMessage: 'Inscription réussie !',
      notifications: {
        email: true
      }
    }
  }
];

const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    formId: 'form-1',
    data: {
      'field-1': 'Jean Dupont',
      'field-2': 'jean@example.com',
      'field-3': 'Intéressé par vos services'
    },
    submittedAt: '2024-07-14T10:30:00Z',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-2',
    formId: 'form-1',
    data: {
      'field-1': 'Marie Dubois',
      'field-2': 'marie@example.com',
      'field-3': 'Demande de devis'
    },
    submittedAt: '2024-07-13T16:45:00Z',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-3',
    formId: 'form-1',
    data: {
      'field-1': 'Pierre Martin',
      'field-2': 'pierre@example.com',
      'field-3': 'Question sur vos tarifs'
    },
    submittedAt: '2024-07-12T14:20:00Z',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-4',
    formId: 'form-1',
    data: {
      'field-1': 'Sophie Leroy',
      'field-2': 'sophie@example.com',
      'field-3': 'Demande de partenariat'
    },
    submittedAt: '2024-07-11T09:15:00Z',
    ipAddress: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-5',
    formId: 'form-1',
    data: {
      'field-1': 'Thomas Bernard',
      'field-2': 'thomas@example.com',
      'field-3': 'Intérêt pour formation'
    },
    submittedAt: '2024-07-10T11:30:00Z',
    ipAddress: '192.168.1.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-6',
    formId: 'form-1',
    data: {
      'field-1': 'Camille Rousseau',
      'field-2': 'camille@example.com',
      'field-3': 'Demande de démonstration'
    },
    submittedAt: '2024-07-09T15:45:00Z',
    ipAddress: '192.168.1.6',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-7',
    formId: 'form-1',
    data: {
      'field-1': 'Nicolas Petit',
      'field-2': 'nicolas@example.com',
      'field-3': 'Question technique'
    },
    submittedAt: '2024-07-08T13:20:00Z',
    ipAddress: '192.168.1.7',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-8',
    formId: 'form-1',
    data: {
      'field-1': 'Émilie Moreau',
      'field-2': 'emilie@example.com',
      'field-3': 'Demande de support'
    },
    submittedAt: '2024-07-07T10:10:00Z',
    ipAddress: '192.168.1.8',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-9',
    formId: 'form-1',
    data: {
      'field-1': 'Julien Garnier',
      'field-2': 'julien@example.com',
      'field-3': 'Proposition de collaboration'
    },
    submittedAt: '2024-07-06T16:30:00Z',
    ipAddress: '192.168.1.9',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-10',
    formId: 'form-1',
    data: {
      'field-1': 'Laure Vincent',
      'field-2': 'laure@example.com',
      'field-3': 'Demande d\'information'
    },
    submittedAt: '2024-07-05T12:45:00Z',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-11',
    formId: 'form-1',
    data: {
      'field-1': 'Antoine Durand',
      'field-2': 'antoine@example.com',
      'field-3': 'Question sur l\'API'
    },
    submittedAt: '2024-07-04T14:15:00Z',
    ipAddress: '192.168.1.11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-12',
    formId: 'form-1',
    data: {
      'field-1': 'Céline Fabre',
      'field-2': 'celine@example.com',
      'field-3': 'Demande de devis personnalisé'
    },
    submittedAt: '2024-07-03T09:30:00Z',
    ipAddress: '192.168.1.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  }
];

const mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['3 formulaires', '500 soumissions/mois', '10 Mo de stockage'],
    maxForms: 3,
    maxSubmissions: 500
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    features: ['20 formulaires', '10 000 soumissions/mois', '100 Mo de stockage', 'Support prioritaire'],
    maxForms: 20,
    maxSubmissions: 10000,
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    features: ['Formulaires illimités', '100 000 soumissions/mois', '500 Mo de stockage', 'Webhooks', 'API'],
    maxForms: -1,
    maxSubmissions: 100000
  }
];

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user
        }
      };
    }
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  register: async (userData: any): Promise<ApiResponse<null>> => {
    await delay(1000);
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists'
      };
    }
    return {
      success: true,
      message: 'Registration successful. Please check your email for verification.'
    };
  },

  me: async (): Promise<ApiResponse<User>> => {
    await delay(200);
    return {
      success: true,
      data: mockUsers[0]
    };
  }
};

// Forms API
export const formsAPI = {
  getAll: async (): Promise<ApiResponse<Form[]>> => {
    await delay(300);
    return {
      success: true,
      data: mockForms
    };
  },

  getById: async (id: string): Promise<ApiResponse<Form>> => {
    await delay(200);
    const form = mockForms.find(f => f.id === id);
    if (form) {
      return {
        success: true,
        data: form
      };
    }
    return {
      success: false,
      error: 'Form not found'
    };
  },

  create: async (formData: Partial<Form>): Promise<ApiResponse<Form>> => {
    await delay(500);
    const newForm: Form = {
      id: `form-${Date.now()}`,
      title: formData.title || 'Nouveau formulaire',
      description: formData.description || '',
      status: 'draft',
      submissionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-1',
      fields: formData.fields || [],
      settings: formData.settings || {
        theme: {
          primaryColor: '#3B82F6',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937'
        },
        successMessage: 'Merci pour votre soumission !',
        notifications: {
          email: true
        }
      }
    };
    mockForms.push(newForm);
    return {
      success: true,
      data: newForm
    };
  },

  update: async (id: string, formData: Partial<Form>): Promise<ApiResponse<Form>> => {
    await delay(400);
    const index = mockForms.findIndex(f => f.id === id);
    if (index !== -1) {
      mockForms[index] = { ...mockForms[index], ...formData, updatedAt: new Date().toISOString() };
      return {
        success: true,
        data: mockForms[index]
      };
    }
    return {
      success: false,
      error: 'Form not found'
    };
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    await delay(300);
    const index = mockForms.findIndex(f => f.id === id);
    if (index !== -1) {
      mockForms.splice(index, 1);
      return {
        success: true
      };
    }
    return {
      success: false,
      error: 'Form not found'
    };
  }
};

// Submissions API
export const submissionsAPI = {
  getByFormId: async (formId: string): Promise<ApiResponse<Submission[]>> => {
    await delay(300);
    const submissions = mockSubmissions.filter(s => s.formId === formId);
    return {
      success: true,
      data: submissions
    };
  },

  exportCsv: async (formId: string): Promise<ApiResponse<string>> => {
    await delay(1000);
    const submissions = mockSubmissions.filter(s => s.formId === formId);
    const form = mockForms.find(f => f.id === formId);
    
    if (!form) {
      return {
        success: false,
        error: 'Form not found'
      };
    }

    let csv = 'Date;IP;';
    form.fields.forEach(field => {
      csv += `${field.label};`;
    });
    csv += '\n';

    submissions.forEach(submission => {
      csv += `${new Date(submission.submittedAt).toLocaleDateString()};${submission.ipAddress};`;
      form.fields.forEach(field => {
        csv += `${submission.data[field.id] || ''};`;
      });
      csv += '\n';
    });

    return {
      success: true,
      data: csv
    };
  }
};

// Plans API
export const plansAPI = {
  getAll: async (): Promise<ApiResponse<Plan[]>> => {
    await delay(200);
    return {
      success: true,
      data: mockPlans
    };
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    await delay(400);
    return {
      success: true,
      data: {
        totalForms: mockForms.length,
        totalSubmissions: mockSubmissions.length,
        publishedForms: mockForms.filter(f => f.status === 'published').length,
        submissionsThisMonth: mockSubmissions.filter(s => {
          const date = new Date(s.submittedAt);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length,
        recentSubmissions: mockSubmissions.slice(-5).reverse()
      }
    };
  }
};