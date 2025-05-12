#!/bin/sh
# This script sets the Terraform variables and backend files.

# Usage: PROJECT_ID="mormedi-aggregator-456814" REGION="europe-west1"  BRANCH_NAME="feature/My_Branch" CLOUD_RUN_IMAGE_NAME="gcr.io/mormedi-aggregator-456814/apis:21633de1a71039100926705408d95ba7d0ce56ef" ./set_tf_config.sh

# Paths of the files to be written
BACKEND_TF_FILE="./backend.tf"
TFVARS_FILE="./terraform.tfvars"

# Sanitize the branch name to be used in the configuration
SANITIZED_BRANCH_NAME=$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')

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

# Write the Terraform variables to the terraform.tfvars file
echo "# Terraform variables" > $TFVARS_FILE
write_var "project_id" "$PROJECT_ID"
write_var "region" "$REGION"
write_var "branch_name" "$SANITIZED_BRANCH_NAME"
write_var "cloud_run_image_name" "$CLOUD_RUN_IMAGE_NAME"
read_file $TFVARS_FILE

# Write the backend configuration to the backend.tf file
write_backend
read_file $BACKEND_TF_FILE