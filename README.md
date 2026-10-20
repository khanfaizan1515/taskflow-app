# TaskFlow — React ToDo App on AWS EKS

## Overview
React ToDo app deployed to Amazon EKS using Docker, Amazon ECR, Kubernetes, ArgoCD GitOps, and GitHub Actions CI/CD.

## Repositories
- App: https://github.com/khanfaizan1515/taskflow-app
- GitOps: https://github.com/khanfaizan1515/taskflow-gitops

## AWS
- Region: ap-south-1
- EKS cluster: capstone-platform
- ECR repository: taskflow
- Replicas: 2

## CI/CD
GitHub Actions tests and builds the application, pushes a commit-tagged image to ECR, and updates the GitOps repository. ArgoCD synchronizes the deployment.

## Verification
```bash
kubectl get deployment taskflow
kubectl get pods -l app=taskflow
kubectl get service taskflow
kubectl get application taskflow -n argocd
```

## Remaining scope
Terraform provisioning for this TaskFlow project is not included in this repository. S3 and DynamoDB application usage is unverified. GitHub Actions is the verified CI/CD pipeline; CircleCI configuration remains unverified.
