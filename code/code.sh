#!/bin/bash

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Navigate to the child directory
cd Dass

# Run manage.py
echo "Running manage.py..."
python3 manage.py runserver

