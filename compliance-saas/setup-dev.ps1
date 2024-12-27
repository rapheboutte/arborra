# Check if Docker Desktop is installed
$dockerDesktop = Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*Docker Desktop*" }

if (-not $dockerDesktop) {
    Write-Host "Docker Desktop is not installed. Installing..."
    
    # Download Docker Desktop Installer
    $installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
    Invoke-WebRequest -Uri "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe" -OutFile $installerPath
    
    # Install Docker Desktop
    Start-Process -FilePath $installerPath -ArgumentList "install --quiet" -Wait
    
    Write-Host "Docker Desktop installed. Please restart your computer and run this script again."
    exit
}

# Check if Docker is running
$dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerProcess) {
    Write-Host "Starting Docker Desktop..."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Start-Sleep -Seconds 30  # Wait for Docker to start
}

# Create .env file from template if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.template .env
    Write-Host "Created .env file from template. Please update the values."
}

# Start containers
docker-compose up -d

# Install npm dependencies
npm install

Write-Host "Development environment setup complete!"
Write-Host "MongoDB available at: localhost:27017"
Write-Host "Redis available at: localhost:6379"
Write-Host "MongoDB Admin UI: http://localhost:8081"
Write-Host "Redis Commander: http://localhost:8082"
