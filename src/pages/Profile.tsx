import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

const AdminProfile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Profil administrateur mis à jour',
        message: 'Vos informations ont été sauvegardées'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de mettre à jour le profil'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Administrateur</h1>
        <p className="text-gray-600">Gérez vos informations d'administrateur système</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Informations administrateur</h3>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                {...register('firstName', {
                  required: 'Le prénom est requis'
                })}
                error={errors.firstName?.message}
              />
              <Input
                label="Nom"
                {...register('lastName', {
                  required: 'Le nom est requis'
                })}
                error={errors.lastName?.message}
              />
            </div>
            <Input
              label="Email administrateur"
              type="email"
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email invalide'
                }
              })}
              error={errors.email?.message}
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privilèges administrateur</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Accès administrateur</p>
                <p className="text-sm text-blue-700">Accès complet à toutes les fonctionnalités</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Gestion des utilisateurs</p>
                <p className="text-sm text-green-700">Suspension, suppression et modération</p>
              </div>
              <div className="text-sm text-green-600">
                Actif
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Statistiques globales</p>
                <p className="text-sm text-purple-700">Accès aux métriques de la plateforme</p>
              </div>
              <div className="text-sm text-purple-600">
                Actif
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Profile() {
  const { user } = useAuth();

  // Show admin profile for admin users
  if (user?.role === 'ADMIN') {
    return <AdminProfile />;
  }

  // Regular user profile
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword
  } = useForm<PasswordForm>();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Profil mis à jour',
        message: 'Vos informations ont été sauvegardées'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de mettre à jour le profil'
      });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPasswordLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Mot de passe modifié',
        message: 'Votre mot de passe a été mis à jour'
      });
      resetPassword();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier le mot de passe'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Compte supprimé',
        message: 'Votre compte a été supprimé définitivement'
      });
      // In real app, would logout and redirect
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le compte'
      });
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et paramètres de sécurité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  {...registerProfile('firstName', {
                    required: 'Le prénom est requis'
                  })}
                  error={profileErrors.firstName?.message}
                />
                <Input
                  label="Nom"
                  {...registerProfile('lastName', {
                    required: 'Le nom est requis'
                  })}
                  error={profileErrors.lastName?.message}
                />
              </div>
              <Input
                label="Email"
                type="email"
                {...registerProfile('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Email invalide'
                  }
                })}
                error={profileErrors.email?.message}
              />
              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Changer le mot de passe</h3>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                label="Mot de passe actuel"
                type="password"
                {...registerPassword('currentPassword', {
                  required: 'Le mot de passe actuel est requis'
                })}
                error={passwordErrors.currentPassword?.message}
              />
              <Input
                label="Nouveau mot de passe"
                type="password"
                {...registerPassword('newPassword', {
                  required: 'Le nouveau mot de passe est requis',
                  minLength: {
                    value: 8,
                    message: 'Le mot de passe doit contenir au moins 8 caractères'
                  }
                })}
                error={passwordErrors.newPassword?.message}
              />
              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                {...registerPassword('confirmPassword', {
                  required: 'La confirmation est requise',
                  validate: (value) => value === newPassword || 'Les mots de passe ne correspondent pas'
                })}
                error={passwordErrors.confirmPassword?.message}
              />
              <Button
                type="submit"
                loading={passwordLoading}
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                Modifier le mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Statut du compte</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Email vérifié</p>
                <p className="text-sm text-green-700">Votre adresse email a été confirmée</p>
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Plan {user?.subscription.plan}</p>
                <p className="text-sm text-blue-700">
                  {user?.subscription.currentForms}/{user?.subscription.maxForms} formulaires utilisés
                </p>
              </div>
              <div className="text-sm text-blue-600">
                {user?.subscription.currentSubmissions}/{user?.subscription.maxSubmissionsPerMonth} soumissions ce mois
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">Gestion du compte</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Supprimer le compte</h4>
              <p className="text-sm text-orange-700 mb-4">
                Cette action est irréversible. Tous vos formulaires et données seront définitivement supprimés.
              </p>
              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon compte
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-900">
                    Êtes-vous sûr de vouloir supprimer votre compte ?
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      onClick={handleDeleteAccount}
                      size="sm"
                    >
                      Oui, supprimer définitivement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      size="sm"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}