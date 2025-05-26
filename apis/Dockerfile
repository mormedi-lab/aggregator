# Use a specific Python version. Slim-buster is a good lightweight choice.
FROM python:3.11-slim-buster

# Set the working directory inside the container
WORKDIR /apis

# Install system packages needed (like uses itgcc for some Python packages)
# Update package lists, install, then clean up to keep the image small
RUN apt-get update \
    && rm -rf /var/lib/apt/lists/*

# Copy just the requirements file first. Docker caches this layer.
# If requirements.txt doesn't change, Docker reuses the cached layer, speeding up builds.
COPY requirements.txt /apis/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r /apis/requirements.txt

# Copy the rest of your application code
# Assumes your FastAPI code is in a directory named 'app'
COPY app /apis/app

# TODO: It's not super clean to copy tests into the image, improve that.
COPY tests /apis/tests
RUN pytest

# Command to run your application when the container starts
# Uses gunicorn as the web server, binding to the port provided by Cloud Run ($PORT)
# Adjust workers/threads based on your app's needs and Cloud Run instance size
# TODO: Uncomment the line below if you want to use gunicorn with multiple workers
#CMD exec uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
CMD exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
