# 📋 Backlog - Remplacement des Mocks par de Vrais Appels API

## 🎯 Vue d'ensemble

Ce backlog détaille toutes les tâches nécessaires pour remplacer les données mockées par de vrais appels API dans l'application FormBuilder. Les tâches sont organisées par priorité et modules fonctionnels.

---

## 🚀 Priorité 1 - Authentification et Sécurité

### 1.1 Service d'authentification

- [ ] **AUTH-001** : Implémenter l'API de connexion (`POST /api/auth/login`)

  - Remplacer `authAPI.login()` dans `src/services/api.ts`
  - Gérer les tokens JWT côté serveur
  - Implémenter la validation des identifiants avec Argon2
  - Gérer les erreurs de connexion (identifiants invalides, compte suspendu)

- [ ] **AUTH-002** : Implémenter l'API d'inscription (`POST /api/auth/register`)

  - Remplacer `authAPI.register()` dans `src/services/api.ts`
  - Validation des données utilisateur (email unique, force du mot de passe)
  - Envoi d'email de vérification
  - Hachage du mot de passe avec Argon2

- [ ] **AUTH-003** : Implémenter l'API de vérification du profil (`GET /api/auth/me`)

  - Remplacer `authAPI.me()` dans `src/services/api.ts`
  - Validation du token JWT côté serveur
  - Retour des informations utilisateur complètes
  - Gestion de l'expiration du token

- [ ] **AUTH-004** : Implémenter la vérification d'email (`GET /api/auth/verify-email`)

  - Remplacer la logique mockée dans `src/pages/auth/EmailVerification.tsx`
  - Validation du token de vérification
  - Mise à jour du statut `is_email_verified`

- [ ] **AUTH-005** : Implémenter la réinitialisation de mot de passe
  - Remplacer la logique mockée dans `src/pages/auth/ForgotPassword.tsx`
  - API de demande de réinitialisation (`POST /api/auth/forgot-password`)
  - API de réinitialisation avec token (`POST /api/auth/reset-password`)

### 1.2 Gestion des tokens et sessions

- [ ] **AUTH-006** : Implémenter la gestion des tokens JWT côté client

  - Stockage sécurisé dans localStorage/sessionStorage
  - Intercepteur pour ajouter le token aux requêtes API
  - Gestion de l'expiration automatique
  - Refresh token si nécessaire

- [ ] **AUTH-007** : Implémenter la déconnexion (`POST /api/auth/logout`)
  - Invalidation du token côté serveur
  - Nettoyage côté client
  - Redirection vers la page de connexion

---

## 📊 Priorité 2 - Gestion des Formulaires

### 2.1 CRUD des formulaires

- [ ] **FORMS-001** : Implémenter l'API de récupération des formulaires (`GET /api/forms`)

  - Remplacer `formsAPI.getAll()` dans `src/services/api.ts`
  - Pagination et filtres (statut, date)
  - Tri par date de création/modification
  - Gestion des permissions utilisateur

- [ ] **FORMS-002** : Implémenter l'API de récupération d'un formulaire (`GET /api/forms/:id`)

  - Remplacer `formsAPI.getById()` dans `src/services/api.ts`
  - Validation des permissions (propriétaire ou admin)
  - Récupération des champs et paramètres

- [ ] **FORMS-003** : Implémenter l'API de création de formulaire (`POST /api/forms`)

  - Remplacer `formsAPI.create()` dans `src/services/api.ts`
  - Validation des données (titre, description)
  - Attribution automatique à l'utilisateur connecté
  - Création de la première version

- [ ] **FORMS-004** : Implémenter l'API de mise à jour de formulaire (`PUT /api/forms/:id`)

  - Remplacer `formsAPI.update()` dans `src/services/api.ts`
  - Validation des permissions
  - Mise à jour de `updated_at`
  - Gestion des champs modifiés

- [ ] **FORMS-005** : Implémenter l'API de suppression de formulaire (`DELETE /api/forms/:id`)
  - Remplacer `formsAPI.delete()` dans `src/services/api.ts`
  - Suppression en cascade (versions, soumissions)
  - Validation des permissions
  - Soft delete optionnel

### 2.2 Versions de formulaires

- [ ] **VERSIONS-001** : Implémenter l'API de récupération des versions (`GET /api/forms/:id/versions`)

  - Remplacer `formVersionsAPI.getByFormId()` dans `src/services/api.ts`
  - Tri par numéro de version décroissant
  - Limitation à 10 versions maximum

- [ ] **VERSIONS-002** : Implémenter l'API de création de version (`POST /api/forms/:id/versions`)

  - Remplacer `formVersionsAPI.create()` dans `src/services/api.ts`
  - Validation du schéma de formulaire
  - Incrémentation automatique du numéro de version
  - Sauvegarde complète du formulaire

- [ ] **VERSIONS-003** : Implémenter l'API de restauration de version (`POST /api/forms/:id/versions/:version/restore`)

  - Remplacer `formVersionsAPI.restore()` dans `src/services/api.ts`
  - Création d'une nouvelle version basée sur l'ancienne
  - Mise à jour du formulaire principal

- [ ] **VERSIONS-004** : Implémenter l'API de suppression de version (`DELETE /api/forms/:id/versions/:version`)
  - Remplacer `formVersionsAPI.delete()` dans `src/services/api.ts`
  - Validation (pas de suppression de la version active)
  - Mise à jour des références

### 2.3 Publication et intégration

- [ ] **FORMS-006** : Implémenter l'API de publication (`POST /api/forms/:id/publish`)

  - Changement de statut vers "published"
  - Génération du token JWT pour l'iframe
  - Mise à jour de `published_at`

- [ ] **FORMS-007** : Implémenter l'API de génération du code iframe (`GET /api/forms/:id/embed`)
  - Génération du code HTML avec token JWT
  - Paramètres de personnalisation (couleurs, messages)
  - Validation des permissions

---

## 📝 Priorité 3 - Gestion des Soumissions

### 3.1 Collecte des soumissions

- [ ] **SUBMISSIONS-001** : Implémenter l'API de soumission (`POST /api/forms/:id/submit`)

  - Validation des données selon le schéma du formulaire
  - Vérification des quotas utilisateur
  - Enregistrement de l'IP et timestamp
  - Notifications email si configurées

- [ ] **SUBMISSIONS-002** : Implémenter l'API de récupération des soumissions (`GET /api/forms/:id/submissions`)
  - Remplacer `submissionsAPI.getByFormId()` dans `src/services/api.ts`
  - Pagination et filtres (date, statut)
  - Tri par date de soumission
  - Validation des permissions

### 3.2 Export et analyse

- [ ] **SUBMISSIONS-003** : Implémenter l'API d'export CSV (`GET /api/forms/:id/submissions/export`)

  - Remplacer `submissionsAPI.exportCsv()` dans `src/services/api.ts`
  - Génération du fichier CSV avec en-têtes
  - Gestion des caractères spéciaux
  - Téléchargement sécurisé

- [ ] **SUBMISSIONS-004** : Implémenter les statistiques de soumissions
  - Nombre de soumissions par période
  - Taux de conversion
  - Temps moyen de remplissage

---

## 💳 Priorité 4 - Gestion des Abonnements et Paiements

### 4.1 Plans et abonnements

- [ ] **SUBSCRIPTIONS-001** : Implémenter l'API de récupération des plans (`GET /api/plans`)

  - Remplacer `plansAPI.getAll()` dans `src/services/api.ts`
  - Récupération depuis la base de données
  - Tri par prix croissant

- [ ] **SUBSCRIPTIONS-002** : Implémenter l'API de récupération des abonnements (`GET /api/users/:id/subscriptions`)

  - Remplacer `subscriptionsAPI.getByUserId()` dans `src/services/api.ts`
  - Historique des abonnements
  - Statut actuel et dates

- [ ] **SUBSCRIPTIONS-003** : Implémenter l'API de création d'abonnement (`POST /api/subscriptions`)

  - Intégration avec Stripe
  - Création du customer et subscription
  - Mise à jour du plan utilisateur

- [ ] **SUBSCRIPTIONS-004** : Implémenter l'API de modification d'abonnement (`PUT /api/subscriptions/:id`)
  - Changement de plan
  - Prorata des paiements
  - Mise à jour des quotas

### 4.2 Webhooks Stripe

- [ ] **STRIPE-001** : Implémenter les webhooks Stripe

  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`

- [ ] **STRIPE-002** : Gestion des échecs de paiement
  - Notification utilisateur
  - Rétrogradation automatique au plan gratuit
  - Suspension des fonctionnalités premium

---

## 📊 Priorité 5 - Gestion des Quotas

### 5.1 Suivi des quotas

- [ ] **QUOTAS-001** : Implémenter l'API de récupération des quotas (`GET /api/users/:id/quotas`)

  - Remplacer `quotaAPI.getByUserId()` dans `src/services/api.ts`
  - Calcul en temps réel des utilisations
  - Comparaison avec les limites du plan

- [ ] **QUOTAS-002** : Implémenter la vérification des quotas avant actions
  - Vérification avant création de formulaire
  - Vérification avant soumission
  - Vérification avant upload de fichier

### 5.2 Notifications de quotas

- [ ] **QUOTAS-003** : Implémenter les notifications automatiques
  - Notification à 80% d'utilisation
  - Notification à 100% d'utilisation
  - Blocage des actions au-delà des limites

---

## 🎛️ Priorité 6 - Tableau de Bord et Statistiques

### 6.1 Statistiques utilisateur

- [ ] **DASHBOARD-001** : Implémenter l'API de statistiques (`GET /api/dashboard/stats`)

  - Remplacer `dashboardAPI.getStats()` dans `src/services/api.ts`
  - Calcul des métriques en temps réel
  - Agrégation des données utilisateur

- [ ] **DASHBOARD-002** : Implémenter les graphiques de performance
  - Soumissions par période
  - Formulaires les plus populaires
  - Évolution des quotas

### 6.2 Statistiques administrateur

- [ ] **ADMIN-001** : Implémenter l'API de statistiques admin (`GET /api/admin/stats`)

  - Remplacer les données mockées dans `src/pages/admin/AdminDashboard.tsx`
  - Métriques globales de la plateforme
  - Revenus et croissance

- [ ] **ADMIN-002** : Implémenter l'API de gestion des utilisateurs (`GET /api/admin/users`)
  - Liste des utilisateurs avec filtres
  - Actions de suspension/suppression
  - Statistiques par utilisateur

---

## 🔧 Priorité 7 - Configuration et Paramètres

### 7.1 Paramètres utilisateur

- [ ] **SETTINGS-001** : Implémenter l'API de récupération des paramètres (`GET /api/users/:id/settings`)

  - Remplacer les données mockées dans `src/pages/Settings.tsx`
  - Préférences de notifications
  - Configuration des webhooks

- [ ] **SETTINGS-002** : Implémenter l'API de mise à jour des paramètres (`PUT /api/users/:id/settings`)
  - Sauvegarde des préférences
  - Validation des données
  - Mise à jour en temps réel

### 7.2 Paramètres administrateur

- [ ] **ADMIN-003** : Implémenter l'API de paramètres système (`GET /api/admin/settings`)
  - Remplacer les données mockées dans `src/pages/Settings.tsx` (AdminSettings)
  - Configuration globale de la plateforme
  - Mode maintenance

---

## 🛡️ Priorité 8 - Sécurité et Validation

### 8.1 Validation des données

- [ ] **SECURITY-001** : Implémenter la validation côté serveur

  - Validation des schémas de formulaires
  - Sanitisation des données utilisateur
  - Protection contre les injections

- [ ] **SECURITY-002** : Implémenter la gestion des permissions
  - Vérification des rôles utilisateur
  - Accès aux ressources (formulaires, soumissions)
  - Audit des actions sensibles

### 8.2 Protection CSRF et CORS

- [ ] **SECURITY-003** : Configurer la protection CSRF

  - Tokens CSRF pour les formulaires
  - Validation côté serveur
  - Protection des endpoints sensibles

- [ ] **SECURITY-004** : Configurer CORS pour l'iframe
  - Autorisation des domaines tiers
  - Headers de sécurité appropriés
  - Gestion des credentials

---

## 🔄 Priorité 9 - Optimisations et Performance

### 9.1 Cache et optimisation

- [ ] **PERF-001** : Implémenter le cache côté client

  - Cache des formulaires fréquemment consultés
  - Cache des statistiques
  - Invalidation intelligente du cache

- [ ] **PERF-002** : Optimiser les requêtes API
  - Pagination des listes longues
  - Requêtes optimisées avec jointures
  - Indexation de la base de données

### 9.2 Monitoring et logs

- [ ] **MONITORING-001** : Implémenter le logging des erreurs
  - Capture des erreurs API
  - Logs de performance
  - Alertes automatiques

---

## 🧪 Priorité 10 - Tests et Documentation

### 10.1 Tests API

- [ ] **TESTS-001** : Créer les tests unitaires pour les services API

  - Tests des fonctions de transformation
  - Tests des validations
  - Tests des erreurs

- [ ] **TESTS-002** : Créer les tests d'intégration
  - Tests des endpoints complets
  - Tests avec base de données
  - Tests de performance

### 10.2 Documentation

- [ ] **DOC-001** : Documenter les APIs
  - Documentation OpenAPI/Swagger
  - Exemples d'utilisation
  - Codes d'erreur

---
