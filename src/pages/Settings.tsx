import { Bell, Key, RefreshCw, Save, Shield, Webhook } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
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
        <h1 className="text-3xl font-bold text-text-100">Paramètres Système</h1>
        <p className="text-surface-400 mt-2">
          Configuration globale de la plateforme
        </p>
      </div>

      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-accent-500" />
            <h3 className="text-lg font-semibold text-text-100">
              Paramètres de sécurité
            </h3>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <div className="space-y-4 flex-1">
            <Toggle
              label="Mode maintenance"
              description="Désactiver l'accès utilisateur temporairement"
              checked={settings.maintenanceMode}
              onChange={(checked) =>
                handleSettingChange("maintenanceMode", checked)
              }
            />

            <Toggle
              label="Inscription utilisateur"
              description="Permettre aux nouveaux utilisateurs de s'inscrire"
              checked={settings.userRegistration}
              onChange={(checked) =>
                handleSettingChange("userRegistration", checked)
              }
            />

            <Toggle
              label="Notifications email"
              description="Envoyer des notifications par email"
              checked={settings.emailNotifications}
              onChange={(checked) =>
                handleSettingChange("emailNotifications", checked)
              }
            />

            <Toggle
              label="Journal d'audit"
              description="Enregistrer toutes les actions administrateur"
              checked={settings.auditLogging}
              onChange={(checked) =>
                handleSettingChange("auditLogging", checked)
              }
            />

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
          </div>
          <div className="mt-6">
            <Button
              onClick={handleSaveSettings}
              loading={loading}
              className="w-full"
              variant="accent"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les paramètres
            </Button>
          </div>
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
  const [webhookEnabled, setWebhookEnabled] = useState(false);

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
        <h1 className="text-3xl font-bold text-text-100">
          Paramètres utilisateur
        </h1>
        <p className="text-surface-400 mt-2">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">
                Notifications
              </h3>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <Toggle
                label="Notifications email"
                description="Recevoir des notifications par email"
                checked={notifications.email}
                onChange={(checked) =>
                  handleNotificationChange("email", checked)
                }
              />

              <Toggle
                label="Notifications navigateur"
                description="Afficher les notifications dans le navigateur"
                checked={notifications.browser}
                onChange={(checked) =>
                  handleNotificationChange("browser", checked)
                }
              />

              <Toggle
                label="Emails marketing"
                description="Recevoir des offres et nouveautés"
                checked={notifications.marketing}
                onChange={(checked) =>
                  handleNotificationChange("marketing", checked)
                }
              />
            </div>
            <div className="mt-6">
              <Button
                onClick={handleSaveSettings}
                loading={loading}
                className="w-full"
                variant="accent"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-semibold text-text-100">Clé API</h3>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="space-y-4 flex-1">
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
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Régénérer
                  </Button>
                </div>
                <p className="text-xs text-surface-500 mt-3">
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
            <Toggle
              label="Activer les webhooks"
              description="Recevoir les soumissions en temps réel"
              checked={webhookEnabled}
              onChange={setWebhookEnabled}
            />
            <div className="mt-6">
              <Button variant="accent" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le webhook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
