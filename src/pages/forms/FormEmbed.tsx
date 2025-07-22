import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Form, FormField } from '../../types';
import { formsAPI } from '../../services/api';

export function FormEmbed() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const token = searchParams.get('token');

  useEffect(() => {
    if (id && token) {
      fetchForm();
    } else {
      setError('Paramètres manquants');
      setLoading(false);
    }
  }, [id, token]);

  const fetchForm = async () => {
    try {
      // In real app, would verify JWT token here
      const response = await formsAPI.getById(id!);
      if (response.success && response.data) {
        if (response.data.status !== 'published') {
          setError('Ce formulaire n\'est pas disponible');
        } else {
          setForm(response.data);
        }
      } else {
        setError('Formulaire non trouvé');
      }
    } catch (error) {
      setError('Erreur lors du chargement du formulaire');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return 'Ce champ est obligatoire';
    }

    if (field.type === 'email' && value) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        return 'Email invalide';
      }
    }

    if (field.type === 'number' && value) {
      if (isNaN(Number(value))) {
        return 'Veuillez entrer un nombre valide';
      }
    }

    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate all fields
    const errors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        errors[field.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate quota check (random failure for demo)
      if (Math.random() < 0.1) {
        throw new Error('Quota dépassé - formulaire temporairement indisponible');
      }
      
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = validationErrors[field.id];
    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={baseClasses}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">{field.placeholder || 'Sélectionner une option'}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required={field.required}
            />
            <span className="ml-2 text-sm text-gray-700">{field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required={field.required}
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Merci !</h2>
          <p className="text-gray-600">
            {form?.settings.successMessage || 'Votre soumission a été envoyée avec succès.'}
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Formulaire non trouvé</h2>
          <p className="text-gray-600">Ce formulaire n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{ 
        backgroundColor: form.settings.theme.backgroundColor,
        color: form.settings.theme.textColor 
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FormBuilder</h1>
          <p className="text-gray-600">Formulaire sécurisé et professionnel</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id}>
                {field.type !== 'checkbox' && (
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
                {validationErrors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors[field.id]}</p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              loading={submitting}
              className="w-full"
              size="lg"
              style={{ backgroundColor: form.settings.theme.primaryColor }}
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Propulsé par <span className="font-semibold text-blue-600">FormBuilder</span>
          </p>
        </div>
      </div>
    </div>
  );
}