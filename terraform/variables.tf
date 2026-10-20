variable "aws_region" {
  description = "AWS region for TaskFlow infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used to identify TaskFlow resources"
  type        = string
  default     = "taskflow"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "study"
}

variable "vpc_cidr" {
  description = "CIDR range for the dedicated TaskFlow VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "kubernetes_version" {
  description = "Kubernetes version for the TaskFlow EKS cluster"
  type        = string
  default     = "1.36"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.small"
}
