#!/usr/bin/env bash
# ==============================================================================
# CoBuild PropTech - 1-Click Google Cloud Run Deployment Script (Bash / Cloud Shell)
# ==============================================================================

set -e

PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${2:-me-central1}"
SERVICE_NAME="${3:-cobuild-proptech}"

echo "================================================================="
echo " CoBuild PropTech Platform - Google Cloud Run Deployment"
echo "================================================================="

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" == "(unset)" ]; then
    echo "Please enter your Google Cloud Project ID:"
    read -r PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "[+] Project ID:   $PROJECT_ID"
echo "[+] Region:       $REGION"
echo "[+] Service Name: $SERVICE_NAME"

echo ""
echo "[*] Enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

echo ""
echo "[*] Building and deploying to Google Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 8080

echo ""
echo "================================================================="
echo " Deployment Complete! CoBuild is Live on Google Cloud."
echo "================================================================="
