# 📋 Backlog UI React - FormBuilder SaaS

## 🎯 Vue d'ensemble

Ce backlog détaille toutes les tâches nécessaires pour remplacer les données mockées par de vrais appels API dans l'application FormBuilder. Les tâches sont organisées par priorité et modules fonctionnels.

---

## 🚀 Priorité 1 - Authentification et Sécurité

### 1.1 Service d'authentification

- [x] **AUTH-001** : Implémenter l'API de connexion (`POST /api/auth/login`)

  - Implémenter `authAPI.login()` dans `src/services/api/auth/authService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Gérer les tokens JWT côté serveur
  - Implémenter la validation des identifiants avec Argon2
  - Gérer les erreurs de connexion (identifiants invalides, compte suspendu)
  - Mettre à jour `src/contexts/AuthProvider.tsx` pour utiliser le nouveau service

- [x] **AUTH-002** : Implémenter l'API d'inscription (`POST /api/auth/register`)

  - Implémenter `authAPI.register()` dans `src/services/api/auth/authService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Validation des données utilisateur (email unique, force du mot de passe)
  - Envoi d'email de vérification
  - Hachage du mot de passe avec Argon2
  - Mettre à jour `src/pages/auth/Register.tsx` pour utiliser le nouveau service

- [x] **AUTH-003** : Implémenter l'API de vérification du profil (`GET /api/auth/me`)

  - Implémenter `authAPI.me()` dans `src/services/api/auth/authService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Validation du token JWT côté serveur
  - Retour des informations utilisateur complètes
  - Gestion de l'expiration du token
  - Mettre à jour `src/contexts/AuthProvider.tsx` pour utiliser le nouveau service

- [x] **AUTH-004** : Implémenter la vérification d'email (`GET /api/auth/verify-email`)

  - Remplacer la logique mockée dans `src/pages/auth/EmailVerification.tsx`
  - Validation du token de vérification
  - Mise à jour du statut `is_email_verified`
  - Gestion des erreurs de vérification

- [x] **AUTH-005** : Implémenter la réinitialisation de mot de passe

  - Remplacer la logique mockée dans `src/pages/auth/ForgotPassword.tsx`
  - API de demande de réinitialisation (`POST /api/auth/forgot-password`)
  - API de réinitialisation avec token (`POST /api/auth/reset-password`)
  - Validation des tokens de réinitialisation

- [x] **AUTH-006** : Implémenter la déconnexion (`POST /api/auth/logout`)
  - Invalidation du token côté serveur
  - Nettoyage côté client
  - Redirection vers la page de connexion
  - Mettre à jour `src/contexts/AuthProvider.tsx`

---

## 📊 Priorité 2 - Gestion des Formulaires

### 2.1 Migration des services de formulaires

- [x] **FORMS-000** : Migrer les services de formulaires vers la nouvelle architecture
  - Implémenter `formsAPI` dans `src/services/api/forms/formsService.ts`
  - Implémenter `formVersionsAPI` dans `src/services/api/forms/versionsService.ts`
  - Créer les types dans `src/services/api/forms/formsTypes.ts`
  - Mettre à jour tous les imports dans les composants :
    - `src/pages/forms/FormsList.tsx`
    - `src/pages/forms/FormBuilder.tsx`
    - `src/pages/forms/FormEmbed.tsx`
    - `src/pages/forms/FormSubmissions.tsx`
    - `src/hooks/useForms.tsx`
    - `src/hooks/useFormHistory.tsx`
    - `src/hooks/useFormVersions.tsx`
    - `src/components/forms/FormHistory.tsx`
  - Tester que toutes les fonctionnalités marchent encore
  - Valider que les types sont correctement exportés

### 2.2 CRUD des formulaires

- [x] **FORMS-001** : Implémenter l'API de récupération des formulaires (`GET /api/forms`)

  - Migrer `formsAPI.getAll()` dans `src/services/api/forms/formsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Pagination et filtres (statut, date)
  - Tri par date de création/modification
  - Gestion des permissions utilisateur
  - Mettre à jour `src/hooks/useForms.tsx` pour utiliser le nouveau service

- [x] **FORMS-002** : Implémenter l'API de récupération d'un formulaire (`GET /api/forms/:id`)

  - Migrer `formsAPI.getById()` dans `src/services/api/forms/formsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Validation des permissions (propriétaire ou admin)
  - Récupération des champs et paramètres
  - Mettre à jour `src/pages/forms/FormBuilder.tsx` pour utiliser le nouveau service

- [x] **FORMS-003** : Implémenter l'API de création de formulaire (`POST /api/forms`)

  - Migrer `formsAPI.create()` dans `src/services/api/forms/formsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Validation des données (titre, description)
  - Attribution automatique à l'utilisateur connecté
  - Création de la première version
  - Mettre à jour `src/pages/forms/FormBuilder.tsx` pour utiliser le nouveau service

- [x] **FORMS-004** : Implémenter l'API de mise à jour de formulaire (`PUT /api/forms/:id`)

  - Migrer `formsAPI.update()` dans `src/services/api/forms/formsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Validation des permissions
  - Mise à jour de `updated_at`
  - Gestion des champs modifiés
  - Mettre à jour `src/pages/forms/FormBuilder.tsx` pour utiliser le nouveau service

- [x] **FORMS-005** : Implémenter l'API de suppression de formulaire (`DELETE /api/forms/:id`)
  - Migrer `formsAPI.delete()` dans `src/services/api/forms/formsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Suppression en cascade (versions, soumissions)
  - Validation des permissions
  - Soft delete optionnel
  - Mettre à jour `src/pages/forms/FormsList.tsx` pour utiliser le nouveau service

### 2.3 Versions de formulaires

- [x] **VERSIONS-001** : Implémenter l'API de récupération des versions (`GET /api/forms/:id/versions`)

  - Migrer `formVersionsAPI.getByFormId()` dans `src/services/api/forms/versionsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Tri par numéro de version décroissant
  - Limitation à 10 versions maximum
  - Mettre à jour `src/hooks/useFormVersions.tsx` pour utiliser le nouveau service

- [x] **VERSIONS-002** : Implémenter l'API de création de version (`POST /api/forms/:id/versions`)

  - Remplacer `formVersionsAPI.create()` dans `src/services/api/forms/versionsService.ts`
  - Validation du schéma de formulaire
  - Incrémentation automatique du numéro de version
  - Sauvegarde complète du formulaire
  - Mettre à jour `src/hooks/useFormHistory.tsx` pour utiliser le nouveau service

- [x] **VERSIONS-003** : Implémenter l'API de restauration de version (`POST /api/forms/:id/versions/:version/restore`)

  - Remplacer `formVersionsAPI.restore()` dans `src/services/api/forms/versionsService.ts`
  - Création d'une nouvelle version basée sur l'ancienne
  - Mise à jour du formulaire principal
  - Mettre à jour `src/components/forms/FormHistory.tsx` pour utiliser le nouveau service

- [x] **VERSIONS-004** : Implémenter l'API de suppression de version (`DELETE /api/forms/:id/versions/:version`)
  - Remplacer `formVersionsAPI.delete()` dans `src/services/api/forms/versionsService.ts`
  - Validation (pas de suppression de la version active)
  - Mise à jour des références
  - Mettre à jour `src/components/forms/FormHistory.tsx` pour utiliser le nouveau service

### 2.4 Publication et intégration

- [x] **FORMS-006** : Implémenter l'API de publication (`POST /api/forms/:id/publish`)

  - Changement de statut vers "PUBLISHED"
  - Génération du token JWT pour l'iframe
  - Mise à jour de `published_at`
  - Mettre à jour `src/pages/forms/FormBuilder.tsx` pour utiliser le nouveau service

- [x] **FORMS-007** : Implémenter l'API de génération du code iframe (`GET /api/public/forms/:id/embed`)
  - Génération du code HTML avec token JWT
  - Paramètres de personnalisation (couleurs, messages)
  - Validation des permissions
  - Mettre à jour `src/pages/forms/FormEmbed.tsx` pour utiliser le nouveau service

---

## 📝 Priorité 3 - Gestion des Soumissions

### 3.1 Migration des services de soumissions

- [x] **SUBMISSIONS-000** : Migrer les services de soumissions vers la nouvelle architecture
  - Implémenter `submissionsAPI` dans `src/services/api/submissions/submissionsService.ts`
  - Créer les types dans `src/services/api/submissions/submissionsTypes.ts`
  - Mettre à jour tous les imports dans les composants :
    - `src/pages/forms/FormSubmissions.tsx`
  - Tester que toutes les fonctionnalités marchent encore
  - Valider que les types sont correctement exportés

### 3.2 Collecte des soumissions

- [x] **SUBMISSIONS-001** : Implémenter l'API de soumission (`POST /api/forms/:id/submit`)

  - Validation des données selon le schéma du formulaire
  - Vérification des quotas utilisateur
  - Enregistrement de l'IP et timestamp
  - Notifications email si configurées

- [x] **SUBMISSIONS-002** : Implémenter l'API de récupération des soumissions (`GET /api/forms/:id/submissions`)
  - Migrer `submissionsAPI.getByFormId()` dans `src/services/api/submissions/submissionsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Pagination et filtres (date, statut)
  - Tri par date de soumission
  - Validation des permissions
  - Mettre à jour `src/pages/forms/FormSubmissions.tsx` pour utiliser le nouveau service

### 3.3 Export et analyse

- [x] **SUBMISSIONS-003** : Implémenter l'API d'export CSV (`GET /api/forms/:id/submissions/export`)

  - Migrer `submissionsAPI.exportCsv()` dans `src/services/api/submissions/submissionsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Génération du fichier CSV avec en-têtes
  - Gestion des caractères spéciaux
  - Téléchargement sécurisé
  - Mettre à jour `src/pages/forms/FormSubmissions.tsx` pour utiliser le nouveau service

- [x] **SUBMISSIONS-004** : Implémenter les statistiques de soumissions
  - Nombre de soumissions par période
  - Taux de conversion
  - Temps moyen de remplissage

---

## 💳 Priorité 4 - Gestion des Abonnements et Paiements

### 4.1 Migration des services d'abonnements

- [x] **SUBSCRIPTIONS-000** : Migrer les services d'abonnements vers la nouvelle architecture
  - Déplacer `plansAPI` et `subscriptionsAPI` vers `src/services/api/subscriptions/subscriptionsService.ts`
  - Créer les types dans `src/services/api/subscriptions/subscriptionsTypes.ts`
  - Mettre à jour tous les imports dans les composants :
    - `src/pages/Subscription.tsx`
    - `src/hooks/useSubscriptions.tsx`
    - `src/hooks/useStripe.tsx` (nouveau hook créé)
  - Tester que toutes les fonctionnalités marchent encore
  - Valider que les types sont correctement exportés

### 4.2 Plans et abonnements

- [x] **SUBSCRIPTIONS-001** : Implémenter l'API de récupération des plans (`GET /api/plans`)

  - Migrer `plansAPI.getAll()` dans `src/services/api/subscriptions/subscriptionsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Récupération depuis la base de données
  - Tri par prix croissant
  - Mettre à jour `src/hooks/useSubscriptions.tsx` pour utiliser le nouveau service

- [x] **SUBSCRIPTIONS-002** : Implémenter l'API de récupération des abonnements (`GET /api/users/:id/subscriptions`)

  - Migrer `subscriptionsAPI.getByUserId()` dans `src/services/api/subscriptions/subscriptionsService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Historique des abonnements
  - Statut actuel et dates
  - Mettre à jour `src/hooks/useSubscriptions.tsx` pour utiliser le nouveau service

- [x] **SUBSCRIPTIONS-003** : Implémenter l'API de création d'abonnement (`POST /api/subscriptions`)

  - Intégration avec Stripe via Stripe Checkout
  - Création du customer et subscription via `createCheckoutSession()`
  - Abonnements gratuits via `createFreeSubscription()`
  - Mise à jour du plan utilisateur
  - Mettre à jour `src/pages/Subscription.tsx` pour utiliser le nouveau service
  - Hook `useStripe` créé pour gérer les opérations Stripe

- [x] **SUBSCRIPTIONS-004** : Implémenter l'API de modification d'abonnement (`PUT /api/subscriptions/:id`)
  - Changement de plan via `updateSubscription()`
  - Prorata des paiements
  - Mise à jour des quotas
  - Mettre à jour `src/pages/Subscription.tsx` pour utiliser le nouveau service
  - Hook `useStripe` gère les modifications d'abonnement

### 4.3 Intégration Stripe

- [x] **STRIPE-000** : Intégration Stripe complète
  - Configuration des clés publiques Stripe (via API backend)
  - Composants de paiement (hook `useStripe`)
  - Gestion des erreurs de paiement
  - Redirection vers Stripe Checkout
  - Portail client Stripe
  - Webhooks Stripe (gérés côté backend)
  - Gestion des échecs de paiement (gérés côté backend)

---

## 📊 Priorité 5 - Gestion des Quotas

### 5.1 Migration des services de quotas

- [x] **QUOTAS-000** : Migrer les services de quotas vers la nouvelle architecture
  - Implémenter `quotaAPI` dans `src/services/api/quotas/quotasService.ts`
  - Créer les types dans `src/services/api/quotas/quotasTypes.ts`
  - Mettre à jour tous les imports dans les composants :
    - `src/hooks/useQuotas.tsx`
  - Tester que toutes les fonctionnalités marchent encore
  - Valider que les types sont correctement exportés

### 5.2 Suivi des quotas

- [x] **QUOTAS-001** : Implémenter l'API de récupération des quotas (`GET /api/users/:id/quotas`)

  - Migrer `quotaAPI.getByUserId()` dans `src/services/api/quotas/quotasService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Calcul en temps réel des utilisations
  - Comparaison avec les limites du plan
  - Mettre à jour `src/hooks/useQuotas.tsx` pour utiliser le nouveau service

- [x] **QUOTAS-002** : Implémenter la vérification des quotas avant actions
  - Vérification avant création de formulaire
  - Vérification avant soumission
  - Vérification avant upload de fichier

### 5.3 Notifications de quotas

- [x] **QUOTAS-003** : Implémenter les notifications automatiques
  - Notification à 80% d'utilisation
  - Notification à 100% d'utilisation
  - Blocage des actions au-delà des limites

---

## 🎛️ Priorité 6 - Tableau de Bord et Statistiques

### 6.1 Migration des services du tableau de bord

- [x] **DASHBOARD-000** : Migrer les services du tableau de bord vers la nouvelle architecture
  - Implémenter `dashboardAPI` dans `src/services/api/dashboard/dashboardService.ts`
  - Créer les types dans `src/services/api/dashboard/dashboardTypes.ts`
  - Mettre à jour tous les imports dans les composants :
    - `src/pages/Dashboard.tsx`
  - Tester que toutes les fonctionnalités marchent encore
  - Valider que les types sont correctement exportés

### 6.2 Statistiques utilisateur

- [x] **DASHBOARD-001** : Implémenter l'API de statistiques (`GET /api/dashboard/stats`)

  - Migrer `dashboardAPI.getStats()` dans `src/services/api/dashboard/dashboardService.ts`
  - Remplacer la logique mockée par de vrais appels API
  - Calcul des métriques en temps réel
  - Agrégation des données utilisateur
  - Mettre à jour `src/pages/Dashboard.tsx` pour utiliser le nouveau service

- [x] **DASHBOARD-002** : Implémenter les graphiques de performance
  - Soumissions par période
  - Formulaires les plus populaires
  - Évolution des quotas
