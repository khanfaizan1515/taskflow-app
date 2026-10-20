# TaskFlow — React ToDo App on AWS EKS

## Project Overview

TaskFlow is a React-based ToDo application deployed on Amazon EKS.
The project demonstrates containerization, infrastructure as code,
CI/CD automation, Kubernetes deployment, and GitOps using ArgoCD.

## Project Repositories

- Application: https://github.com/khanfaizan1515/taskflow-app
- GitOps: https://github.com/khanfaizan1515/taskflow-gitops

## Architecture

1. React application provides the user interface.
2. Docker packages the application into a container image.
3. GitHub Actions runs the CI/CD workflow.
4. Amazon ECR stores versioned Docker images.
5. GitHub Actions updates the image reference in the GitOps repository.
6. ArgoCD synchronizes Kubernetes resources from the GitOps repository.
7. Amazon EKS runs the application using Kubernetes.
8. Terraform provisions the AWS infrastructure.

## Technologies Used

- React
- Docker
- Git and GitHub
- GitHub Actions
- Amazon ECR
- Amazon EKS
- Kubernetes
- Terraform
- ArgoCD
- Kubernetes HPA
- Metrics Server

## AWS Infrastructure

- AWS Region: ap-south-1
- EKS Cluster: taskflow-eks
- ECR Repository: taskflow
- Kubernetes Deployment: taskflow
- Kubernetes Service: LoadBalancer
- Application replicas: 2
- Horizontal Pod Autoscaler: minimum 2, maximum 5 replicas
- Worker instance type: t3.small

## CI/CD Workflow

The GitHub Actions workflow:

1. Checks out the application source code.
2. Builds the React application and Docker image.
3. Authenticates with AWS using GitHub Actions OIDC.
4. Pushes a commit-tagged image to Amazon ECR.
5. Updates the image reference in the GitOps repository.

ArgoCD monitors the GitOps repository and synchronizes the Kubernetes deployment.

## Infrastructure as Code

Terraform configuration is available in the `terraform/` directory.

The configuration provisions the TaskFlow VPC, networking, IAM roles,
Amazon EKS cluster, and worker node group.

Example commands:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform validate
terraform plan
```

Review the plan before applying infrastructure changes.

**Important:** Terraform state is intentionally excluded from Git.
A fresh clone does not contain the state for existing AWS resources.
Configure a secure remote backend or recover/import the appropriate state
before managing existing infrastructure. Never commit state files or secrets.

## Verify the Deployment

Check the Kubernetes nodes:

```bash
kubectl get nodes
```

Check the application deployment and pods:

```bash
kubectl get deployment taskflow
kubectl get pods -l app=taskflow
```

Check the public service:

```bash
kubectl get service taskflow
```

Check autoscaling and resource metrics:

```bash
kubectl get hpa taskflow
kubectl top pods
```

Check ArgoCD application health:

```bash
kubectl get application taskflow -n argocd
```

The expected ArgoCD status is `Synced` and `Healthy` when the application
is successfully synchronized and running.

## Application Access

The Kubernetes LoadBalancer exposes the application over HTTP.
Retrieve its current address with:

```bash
kubectl get service taskflow
```

Open the external address shown in the `EXTERNAL-IP` column in your browser.

## Current Scope and Limitations

- GitHub Actions is the verified CI/CD pipeline.
- CircleCI is not part of the verified deployment workflow.
- S3 and DynamoDB application integration has not been verified.
- Terraform state files, AWS credentials, and other secrets must not be committed.

## Learning Outcomes

This project demonstrates practical experience with Docker image builds,
AWS infrastructure provisioning, CI/CD automation, Kubernetes deployments,
horizontal pod autoscaling, and GitOps-based application synchronization.
