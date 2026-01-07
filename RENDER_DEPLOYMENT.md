# Render Deployment Guide for WasteWatch

## Option 1: Deploy Without Pillow (Recommended - Easiest)

The app works perfectly without Pillow. Images will be saved as-is without compression.

**Steps:**
1. Make sure `requirements.txt` has Pillow commented out (already done)
2. Deploy to Render normally
3. The app will work without image compression

## Option 2: Deploy With Pillow (If you want image compression)

If you want image compression, you need to install system dependencies on Render.

### Method A: Using render.yaml (Recommended)

Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: wastewatch
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
    # Install system dependencies for Pillow
    buildCommand: |
      apt-get update && apt-get install -y \
        libjpeg-dev \
        zlib1g-dev \
        libtiff-dev \
        libfreetype6-dev \
        liblcms2-dev \
        libwebp-dev \
        && pip install -r requirements.txt
```

Then uncomment Pillow in `requirements.txt`:
```
Flask==3.0.0
Werkzeug==3.0.1
Pillow==10.1.0
```

### Method B: Using Build Script

Create a `build.sh` file:

```bash
#!/bin/bash
apt-get update
apt-get install -y libjpeg-dev zlib1g-dev libtiff-dev libfreetype6-dev liblcms2-dev libwebp-dev
pip install -r requirements.txt
```

Then in Render dashboard:
- Set Build Command to: `bash build.sh`
- Make sure Pillow is uncommented in requirements.txt

### Method C: Use Docker (Most Reliable)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies for Pillow
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    libtiff-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

Then in Render:
- Set to Docker deployment
- Use the Dockerfile

## Current Setup (No Pillow)

Your current setup works without Pillow:
- ✅ Images are uploaded and saved
- ✅ All features work
- ❌ Images are not compressed (saved as-is)

This is perfectly fine for most use cases. Image compression is optional and the app handles it gracefully.

## Testing Locally

To test without Pillow:
```bash
pip install Flask Werkzeug
python app.py
```

To test with Pillow:
```bash
pip install Flask Werkzeug Pillow
python app.py
```

Both work identically - the only difference is image compression.

