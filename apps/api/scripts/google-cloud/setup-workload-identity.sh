# Run on Google Cloud Shell or local machine with gcloud SDK installed
# See: https://cloud.google.com/blog/ja/products/identity-security/secure-your-use-of-third-party-tools-with-identity-federation

gcloud iam workload-identity-pools create github-actions-pool \
  --location="global" \
--description="The pool to authenticate GitHub actions." \
--display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc github-actions-oidc \
  --workload-identity-pool="github-actions-pool" \
  --issuer-uri="https://token.actions.githubusercontent.com/" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner,attribute.branch=assertion.sub.extract('/heads/{branch}/')" \
--location=global \
--attribute-condition="assertion.repository_owner=='${REPO_OWNER}'"

gcloud iam service-accounts create ${APP_SA_NAME} --display-name="Xodarap Service Account" --description="manages the application resources"

gcloud iam service-accounts create ${NETWORKING_SA_NAME} --display-name="Networking Service Account" --description="manages the networking resources"

gcloud iam service-accounts add-iam-policy-binding ${NETWORKING_SA_EMAIL} \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/${NETWORKING_REPO}"

gcloud iam service-accounts add-iam-policy-binding ${APP_SA_EMAIL} \
  --role="roles/iam.workloadIdentityUser" \
  --member="principal://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-actions-pool/subject/repo:${APP_REPO}:ref:refs/heads/main"

# Check roles
gcloud iam service-accounts get-iam-policy ${APP_SA_EMAIL} --format=json

# Add 4 roles to service account to manage cloud run
# NOTE: Use `projects` instead of `iam service-accounts`
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member=serviceAccount:${APP_SA_EMAIL} \
    --role=roles/artifactregistry.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member=serviceAccount:${APP_SA_EMAIL} \
    --role=roles/iam.serviceAccountUser
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member=serviceAccount:${APP_SA_EMAIL} \
    --role=roles/run.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member=serviceAccount:${APP_SA_EMAIL} \
    --role=roles/iam.workloadIdentityUser