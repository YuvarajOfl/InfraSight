output "instance_id" {
  value       = aws_instance.infrasight_server.id
  description = "The ID of the EC2 instance"
}

output "public_ip" {
  value       = aws_eip.infrasight_eip.public_ip
  description = "The static Elastic IP address associated with the EC2 instance"
}

output "public_dns" {
  value       = aws_eip.infrasight_eip.public_dns
  description = "The public DNS name of the EC2 instance"
}

output "ssh_command" {
  value       = "ssh ubuntu@${aws_eip.infrasight_eip.public_ip}"
  description = "Convenient SSH command to connect to the EC2 instance"
}
