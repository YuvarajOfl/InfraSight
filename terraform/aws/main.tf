# 1. Fetch default VPC and Subnet details
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 2. Get latest Ubuntu 22.04 LTS Jammy AMI
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# 3. Security Group allowing SSH (22), HTTP (80), and HTTPS (443)
resource "aws_security_group" "infrasight_sg" {
  name        = "${var.project_name}-sg"
  description = "Security Group for InfraSight EC2 hosting allowing Web & SSH ingress"
  vpc_id      = data.aws_vpc.default.id

  # SSH Ingress
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP Ingress
  ingress {
    description = "HTTP web access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS Ingress
  ingress {
    description = "HTTPS secure web access"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Egress (All Outbound allowed)
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

# 4. Provision EC2 Ubuntu instance
resource "aws_instance" "infrasight_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.infrasight_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = var.volume_size
    volume_type           = var.volume_type
    delete_on_termination = true
    encrypted             = true

    tags = {
      Name = "${var.project_name}-root-volume"
    }
  }

  # User Data Script to automatically bootstrap docker/docker-compose
  user_data = <<-EOF
              #!/bin/bash
              set -e

              # 1. Update and Upgrade packages
              apt-get update -y
              apt-get upgrade -y

              # 2. Install prerequisites
              apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

              # 3. Add Docker's official GPG key
              mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

              # 4. Set up the Docker repository
              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

              # 5. Install Docker Engine and Plugins
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              # 6. Enable and Start Docker Service
              systemctl enable docker
              systemctl start docker

              # 7. Add default ubuntu user to docker group
              usermod -aG docker ubuntu

              # 8. Create application deployment directory
              mkdir -p /home/ubuntu/infrasight
              chown -R ubuntu:ubuntu /home/ubuntu/infrasight
              chmod 755 /home/ubuntu/infrasight
              EOF

  tags = {
    Name = "${var.project_name}-ec2-server"
  }
}

# 5. Elastic IP Allocation
resource "aws_eip" "infrasight_eip" {
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-eip"
  }
}

# 6. Elastic IP Association
resource "aws_eip_association" "infrasight_eip_assoc" {
  instance_id   = aws_instance.infrasight_server.id
  allocation_id = aws_eip.infrasight_eip.id
}
