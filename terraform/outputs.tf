output "vpc_id" {
  description = "TaskFlow VPC ID"
  value       = aws_vpc.taskflow.id
}

output "public_subnet_ids" {
  description = "TaskFlow public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "eks_cluster_name" {
  description = "TaskFlow EKS cluster name"
  value       = aws_eks_cluster.taskflow.name
}

output "eks_cluster_endpoint" {
  description = "TaskFlow EKS API endpoint"
  value       = aws_eks_cluster.taskflow.endpoint
}
