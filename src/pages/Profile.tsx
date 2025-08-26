import { Eye, EyeOff, Lock, Save, Settings, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { userService } from "../services/api/user/userService";

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

const AdminProfile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (formData: { firstName: string; lastName: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await userService.updateProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
  
      if (result.success) {
        addToast({
          type: "success",
          title: "Profil mis à jour",
          message: "Vos informations ont été sauvegardées",
        });
      } else {
        addToast({
          type: "error",
          title: "Erreur",
          message: result.error || "Impossible de mettre à jour le profil",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-modern">
      <div>
        <h1 className="text-3xl font-bold text-text-100">
          Profil Administrateur
        </h1>
        <p className="text-surface-400 mt-2">
          Gérez vos informations d'administrateur système
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-accent-500" />
            <h3 className="text-lg font-semibold text-text-100">
              Informations administrateur
            </h3>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <div className="space-y-4 flex-1">
              <Input
                label="Prénom"
                {...register("firstName", {
                  required: "Le prénom est requis",
                })}
                error={errors.firstName?.message}
              />
              <Input
                label="Nom"
                {...register("lastName", {
                  required: "Le nom est requis",
                })}
                error={errors.lastName?.message}
              />
              <Input
                label="Email administrateur"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                variant="accent"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export function Profile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { changePassword } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword,
  } = useForm<PasswordForm>();

  const newPassword = watch("newPassword");

  // Show admin profile for admin users
  if (user?.role === "ADMIN") {
    return <AdminProfile />;
  }

  const onProfileSubmit = async (formData: { firstName: string; lastName: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await userService.updateProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.success) {
        addToast({
          type: "success",
          title: "Profil mis à jour",
          message: "Vos informations ont été sauvegardées",
        });
      } else {
        addToast({
          type: "error",
          title: "Erreur",
          message: result.error || "Impossible de mettre à jour le profil",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (formData: PasswordForm) => {
    setPasswordLoading(true);
    try {
      const { currentPassword, newPassword } = formData;
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        addToast({
          type: "success",
          title: "Mot de passe modifié",
          message: "Votre mot de passe a été mis à jour",
        });
        resetPassword();
      } else {
        addToast({
          type: "error",
          title: "Erreur",
          message: result.error || "Impossible de modifier le mot de passe",
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast({
        type: "success",
        title: "Compte supprimé",
        message: "Votre compte a été supprimé définitivement",
      });
      // In real app, would logout and redirect
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer le compte",
      });
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-modern">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-100">Profil utilisateur</h1>
        <p className="text-surface-400 mt-2">
          Gérez vos informations personnelles et paramètres de sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
        {/* Profile Information */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">
                Informations personnelles
              </h3>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="flex flex-col h-full"
            >
              <div className="space-y-4 flex-1">
                <Input
                  label="Prénom"
                  {...registerProfile("firstName", {
                    required: "Le prénom est requis",
                  })}
                  error={profileErrors.firstName?.message}
                />
                <Input
                  label="Nom"
                  {...registerProfile("lastName", {
                    required: "Le nom est requis",
                  })}
                  error={profileErrors.lastName?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div className="mt-6">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  variant="accent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">
                Changer le mot de passe
              </h3>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="flex flex-col h-full"
            >
              <div className="space-y-4 flex-1">
                {/* Mot de passe actuel */}
                <div className="relative">
                  <Input
                    label="Mot de passe actuel"
                    type={showCurrent ? "text" : "password"}
                    {...registerPassword("currentPassword", {
                      required: "Le mot de passe actuel est requis",
                    })}
                    error={passwordErrors.currentPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-300"
                  >
                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Nouveau mot de passe */}
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showNew ? "text" : "password"}
                    {...registerPassword("newPassword", {
                      required: "Le nouveau mot de passe est requis",
                      minLength: {
                        value: 8,
                        message: "Le mot de passe doit contenir au moins 8 caractères",
                      },
                    })}
                    error={passwordErrors.newPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-300"
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Confirmer le mot de passe */}
                <div className="relative">
                  <Input
                    label="Confirmer le nouveau mot de passe"
                    type={showConfirm ? "text" : "password"}
                    {...registerPassword("confirmPassword", {
                      required: "La confirmation du mot de passe est requise",
                      validate: (value) =>
                        value === newPassword || "Les mots de passe ne correspondent pas",
                    })}
                    error={passwordErrors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-300"
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  loading={passwordLoading}
                  className="w-full"
                  variant="accent"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">
                Paramètres de compte
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-text-100 mb-2">
                  Supprimer le compte
                </h4>
                <p className="text-base text-surface-400 mb-4">
                  Cette action est irréversible. Toutes vos données seront
                  définitivement supprimées.
                </p>
                {!showDeleteConfirm ? (
                  <Button
                    variant="accent"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-yellow-400">
                      Êtes-vous sûr de vouloir supprimer votre compte ? Cette
                      action ne peut pas être annulée.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Oui, supprimer
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1"
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
    </div>
  );
}
