#!/bin/sh
# This script sets the Terraform variables and backend files.

# Usage: PROJECT_ID="mormedi-aggregator-456814" LOCATION="europe-west1"  BRANCH_NAME="feature/clean_dev_infra" COMMIT_SHA="21633de1a71039100926705408d95ba7d0ce56ef" ./set_tf_config.sh

# Paths of the files to be written
SANITIZED_BRANCH_NAME_FILE="sanitized_branch_name.txt"
APIS_IMAGE_NAME_FILE="apis_image_name.txt"
BACKEND_TF_FILE="./backend.tf"
TFVARS_FILE="./terraform.tfvars"

# Define the env var. By default, it is set to "dev" and it is set to "prod" only for the prod branch.
PROJECT_ENV="dev"
if [ "${BRANCH_NAME}" = "prod" ]; then
  PROJECT_ENV="prod"
fi

# Sanitize the branch name to be used in the configuration
SANITIZED_BRANCH_NAME=$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
# Name of the cloud run image. Tags the image with the unique commit SHA for easy tracking
APIS_IMAGE_NAME="${LOCATION}-docker.pkg.dev/${PROJECT_ID}/docker-repo/${SANITIZED_BRANCH_NAME}/apis:${COMMIT_SHA}"

write_backend () {
  # This function writes the backend configuration to the backend.tf file.
  echo "terraform {" > $BACKEND_TF_FILE
  echo "  backend \"gcs\" {" >> $BACKEND_TF_FILE
  echo "    bucket = \"${PROJECT_ID}-tfstate\"" >> $BACKEND_TF_FILE
  echo "    prefix = \"env/${SANITIZED_BRANCH_NAME}\"" >> $BACKEND_TF_FILE
  echo "  }" >> $BACKEND_TF_FILE
  echo "}" >> $BACKEND_TF_FILE
}

write_var () {
  # This function writes a variable to the terraform.tfvars file.
  LINE="${1}=\"${2}\""
  echo $LINE >> $TFVARS_FILE
  return 1
}

read_file () {
  echo "************ ${1} ************"
  cat $1
  echo "***************************************"
}

# Write the sanitized branch name to a file
echo -n "${SANITIZED_BRANCH_NAME}" > $SANITIZED_BRANCH_NAME_FILE
read_file $SANITIZED_BRANCH_NAME_FILE

# Write the apis image name to a file
echo -n "${APIS_IMAGE_NAME}" > $APIS_IMAGE_NAME_FILE
read_file $APIS_IMAGE_NAME_FILE

# Write the Terraform variables to the terraform.tfvars file
echo "# Terraform variables" > $TFVARS_FILE
write_var "env" "$PROJECT_ENV"
write_var "project_id" "$PROJECT_ID"
write_var "location" "$LOCATION"
write_var "branch_name" "$SANITIZED_BRANCH_NAME"
write_var "apis_image_name" "$APIS_IMAGE_NAME"
read_file $TFVARS_FILE

# Write the backend configuration to the backend.tf file
write_backend
read_file $BACKEND_TF_FILE