# AWS Infrastructure Provisioning for InfraSight

This directory contains Terraform configuration files to provision a simple, secure, and **AWS Free Tier friendly** infrastructure for the `InfraSight` project.

## Directory Structure

```text
terraform/aws/
├── provider.tf             # AWS provider configuration & default tags
├── variables.tf            # Input variables definitions
├── main.tf                 # Resources (Dynamic AMI, SG, EC2 instance, EIP, User Data)
├── outputs.tf              # Outputs (Instance ID, Public IP, DNS, SSH command)
├── terraform.tfvars.example# Example input values template
└── README.md               # This deployment guide
```

---

## Target Architecture

The script provisions a single Ubuntu EC2 instance within the Default VPC:

```text
Internet
   │
   ▼
[Security Group] ──── Allows Ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   │
   ▼
[EC2 Instance] ────── Ubuntu 22.04 LTS (t2.micro / 20GB GP3 Storage)
   │
   └─ [User Data] ─── Automatically installs Docker, Docker Compose, 
                      adds permissions, and sets up '/home/ubuntu/infrasight'
```

---

## Prerequisites

1. **Terraform CLI**: Installed on your local machine ([Download Terraform](https://developer.hashicorp.com/terraform/downloads)).
2. **AWS CLI**: Installed and configured with permissions to provision EC2, Elastic IPs, and Security Groups (`aws configure`).
3. **AWS Key Pair**: An existing SSH key pair created in the target region (e.g., `ap-south-1`).
   - Create one in the AWS Console under **EC2 > Key Pairs**, download the `.pem` file, and keep note of the key pair name.

---

## Deployment Steps

1. **Initialize Workspace**:
   Navigate to the directory and run:
   ```bash
   cd terraform/aws
   terraform init
   ```

2. **Configure Variables**:
   Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
   Open `terraform.tfvars` and set the `key_name` to the exact name of your downloaded AWS SSH Key Pair.

3. **Check Changes (Dry Run)**:
   Verify what resources will be created:
   ```bash
   terraform plan
   ```

4. **Apply Changes**:
   Deploy the infrastructure:
   ```bash
   terraform apply
   ```
   Confirm with `yes` when prompted.

5. **Access Outputs**:
   After a successful apply, Terraform will print the outputs:
   - `instance_id`: The created EC2 instance ID.
   - `public_ip`: The assigned static Elastic IP.
   - `public_dns`: The public DNS record.
   - `ssh_command`: Handy SSH connection command (e.g., `ssh ubuntu@<public_ip>`).

---

## Estimated Monthly AWS Free Tier Costs

| Resource | Free Tier Allowance | Project Consumption | Monthly Cost | Note |
| :--- | :--- | :--- | :--- | :--- |
| **EC2 Instance** | 750 hours/month (t2.micro or t3.micro) | 1 instance running 24/7 (744 hours) | **$0.00** | Free Tier covers one micro instance 24/7. |
| **EBS Storage** | Up to 30 GB of GP2/GP3 | 20 GB GP3 volume | **$0.00** | Well within the 30 GB monthly limit. |
| **Elastic IP** | 1 Elastic IP | 1 EIP attached to running instance | **$0.00** | EIPs are free when attached to a running instance. |
| **Data Transfer** | 100 GB Outbound/month | Small API payloads / Web bundle requests | **$0.00** | Negligible payload sizes. |
| **Total Cost** | - | - | **$0.00** | **100% Free Tier Eligible** |

> [!CAUTION]
> If you terminate or stop the EC2 instance but keep the Elastic IP allocated in your account, AWS will charge **$0.005 per hour** for the unattached Elastic IP. Make sure to run `terraform destroy` when you are done with the portfolio project to release all resources.

---

## Verification Checklist

After the deployment completes successfully:

1. **AWS Console Verification**:
   - Go to the EC2 Dashboard. Verify `infrasight-ec2-server` is in the `running` state.
   - Verify that the static Elastic IP (`infrasight-eip`) is allocated and associated with the instance.
   - Under **Security Groups**, verify `infrasight-sg` is attached and only allows ports 22, 80, and 443.

2. **SSH Connection**:
   Connect to your instance using the output SSH command (pointing to your `.pem` key file):
   ```bash
   ssh -i /path/to/your-key.pem ubuntu@<elastic-ip-address>
   ```

3. **Bootstrap Verification**:
   Verify that the `user_data` script completed successfully:
   - Check if Docker is installed and running:
     ```bash
     docker --version
     docker ps
     ```
   - Check if Docker Compose plugin is installed:
     ```bash
     docker compose version
     ```
   - Check if deployment folder exists:
     ```bash
     ls -la /home/ubuntu/infrasight
     ```

---

## Future CI/CD Deployment Integration

The instance is bootstrap-configured to allow easy automatic deployment from GitLab or GitHub Actions:
1. GitHub Actions logs in via SSH using a private key secret.
2. It transfers the production configuration `docker-compose.prod.yml` and `.env` file into `/home/ubuntu/infrasight/`.
3. It logs into Docker Hub (`docker login`).
4. It executes:
   ```bash
   cd /home/ubuntu/infrasight
   docker compose -f docker-compose.prod.yml pull
   docker compose -f docker-compose.prod.yml up -d
   ```
No infrastructure changes are required to support this workflow.
