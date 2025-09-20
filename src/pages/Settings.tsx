import { Card, CardContent } from "../components/ui/Card";

export function Settings() {
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

      <div className="mt-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-surface-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-100 mb-2">
                Fonctionnalité en cours de développement
              </h2>
              <p className="text-surface-400 max-w-md">
                Cette page sera bientôt disponible avec toutes les options de
                paramétrage de votre compte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
