variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources into"
  default     = "ap-south-1"
}

variable "project_name" {
  type        = string
  description = "Name of the project"
  default     = "infrasight"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "production"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance size (t2.micro is Free Tier eligible in ap-south-1)"
  default     = "t2.micro"
}

variable "key_name" {
  type        = string
  description = "Name of the existing AWS Key Pair for SSH access"
}

variable "volume_size" {
  type        = number
  description = "Size of the GP3 root storage volume in GB (20GB recommended for Free Tier)"
  default     = 20
}

variable "volume_type" {
  type        = string
  description = "Root volume EBS storage type"
  default     = "gp3"
}
