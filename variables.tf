variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "location" {
  description = "The region location used to deploy the resources"
  type        = string
}

variable "branch_name" {
  description = "The sanitized name of the branch, used as a prefix for the services names"
  type        = string
}

variable "apis_image_name" {
  description = "The name of the image to deploy to Cloud Run"
  type        = string
}