locals {
  secret_name = "prod_env"
}

provider "google" {
  project = var.project_id
  region  = var.location
}

module "cloud_run" {
  source = "GoogleCloudPlatform/cloud-run/google"
  version = "~> 0.10.0"

  # Required variables
  service_name = "${var.branch_name}-apis"
  project_id   = var.project_id
  location     = var.location
  image        = var.apis_image_name
  members = ["allUsers"]
  # Secret file with the path /apis/conf/.env
  volumes = [
    {
      name = "secret_env",
      secret = [
        {
          secret_name = local.secret_name,
          items = { key = "latest", "path" = ".env" }
        }
      ]
    }
  ]
  volume_mounts = [
    {
      mount_path = "/apis/conf",
      name       = "secret_env"
    }
  ]
}

# TODO: Change services account
# TODO: Save the image in the registry of the same region europe-west1
# TODO: Add tags to cloud run
# TODO: Move the cloud run in the apis folder into a main.tf file