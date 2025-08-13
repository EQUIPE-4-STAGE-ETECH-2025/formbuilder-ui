import { Bell, Key, Shield, Webhook } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const AdminSettings = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    auditLogging: true,
    dataRetention: "365",
  });
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast({
        type: "success",
        title: "Paramètres système sauvegardés",
        message: "La configuration a été mise à jour",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de sauvegarder les paramètres",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-modern">
      <div>
        <h1 className="text-2xl font-bold text-text-100">Paramètres Système</h1>
        <p className="text-surface-400">
          Configuration globale de la plateforme
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-accent-500" />
            <h3 className="text-lg font-semibold text-text-100">
              Paramètres de sécurité
            </h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-100">Mode maintenance</p>
              <p className="text-sm text-surface-400">
                Désactiver l'accès utilisateur temporairement
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  handleSettingChange("maintenanceMode", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-100">
                Inscription utilisateur
              </p>
              <p className="text-sm text-surface-400">
                Permettre aux nouveaux utilisateurs de s'inscrire
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.userRegistration}
                onChange={(e) =>
                  handleSettingChange("userRegistration", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-100">Notifications email</p>
              <p className="text-sm text-surface-400">
                Envoyer des notifications par email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleSettingChange("emailNotifications", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-100">Journal d'audit</p>
              <p className="text-sm text-surface-400">
                Enregistrer toutes les actions administrateur
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auditLogging}
                onChange={(e) =>
                  handleSettingChange("auditLogging", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-100 mb-2">
              Rétention des données (jours)
            </label>
            <Input
              type="number"
              value={settings.dataRetention}
              onChange={(e) =>
                handleSettingChange("dataRetention", e.target.value)
              }
              className="w-32"
            />
          </div>

          <Button
            onClick={handleSaveSettings}
            loading={loading}
            className="w-full"
            variant="accent"
          >
            Sauvegarder les paramètres
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export function Settings() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    marketing: false,
  });
  const [apiKey, setApiKey] = useState("sk_test_1234567890abcdef");

  // Show admin settings for admin users
  if (user?.role === "ADMIN") {
    return <AdminSettings />;
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast({
        type: "success",
        title: "Paramètres sauvegardés",
        message: "Vos préférences ont été mises à jour",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de sauvegarder les paramètres",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewApiKey = async () => {
    setApiKeyLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newKey = "sk_test_" + Math.random().toString(36).substr(2, 15);
      setApiKey(newKey);
      addToast({
        type: "success",
        title: "Clé API régénérée",
        message: "Une nouvelle clé API a été générée",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de régénérer la clé API",
      });
    } finally {
      setApiKeyLoading(false);
    }
  };

  return (
    <div className="space-modern">
      <div>
        <h1 className="text-2xl font-bold text-text-100">Paramètres</h1>
        <p className="text-surface-400">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">
                Notifications
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-100">Notifications email</p>
                <p className="text-sm text-surface-400">
                  Recevoir des notifications par email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    handleNotificationChange("email", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-100">
                  Notifications navigateur
                </p>
                <p className="text-sm text-surface-400">
                  Afficher les notifications dans le navigateur
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.browser}
                  onChange={(e) =>
                    handleNotificationChange("browser", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-100">Emails marketing</p>
                <p className="text-sm text-surface-400">
                  Recevoir des offres et nouveautés
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) =>
                    handleNotificationChange("marketing", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>

            <Button
              onClick={handleSaveSettings}
              loading={loading}
              className="w-full"
              variant="accent"
            >
              Sauvegarder les préférences
            </Button>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">Clé API</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-100 mb-2">
                Votre clé API
              </label>
              <div className="flex gap-2">
                <Input
                  value={apiKey}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  onClick={generateNewApiKey}
                  loading={apiKeyLoading}
                  variant="secondary"
                >
                  Régénérer
                </Button>
              </div>
              <p className="text-xs text-surface-500 mt-1">
                Utilisez cette clé pour intégrer vos formulaires
              </p>
            </div>

            <div className="p-4 bg-surface-800 rounded-xl">
              <h4 className="font-medium text-text-100 mb-2">
                Exemple d'intégration
              </h4>
              <pre className="text-xs text-surface-400 bg-surface-900 p-3 rounded-lg overflow-x-auto">
                {`<script>
  FormBuilder.init({
    apiKey: '${apiKey}',
    formId: 'your-form-id'
  });
</script>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Webhook className="h-5 w-5 text-accent-500" />
            <h3 className="text-lg font-semibold text-text-100">Webhooks</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-100 mb-2">
                URL du webhook
              </label>
              <Input
                placeholder="https://votre-domaine.com/webhook"
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-100">
                  Activer les webhooks
                </p>
                <p className="text-sm text-surface-400">
                  Recevoir les soumissions en temps réel
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-600/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>
            <Button variant="accent" className="w-full">
              Sauvegarder le webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
